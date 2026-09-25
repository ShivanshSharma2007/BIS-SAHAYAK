import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { LocalDB } from "@/lib/db";
import { redis } from "@/lib/redis";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      checks: ["state"],
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
      token: "https://oauth2.googleapis.com/token",
      userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        name: { label: "Name", type: "text" },
        department: { label: "Department", type: "text" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "isSignUp", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Missing email or OTP");
        }

        const redisKey = `otp:${credentials.email}`;
        const storedOtp = await redis.get(redisKey);

        if (!storedOtp || storedOtp !== credentials.otp) {
          throw new Error("Invalid or expired OTP");
        }

        // OTP is valid, clear it from Redis
        await redis.del(redisKey);

        // Fetch user or create a temporary session user
        let user = await LocalDB.findUserByEmail(credentials.email);
        
        if (credentials.isSignUp === 'true') {
          if (user) {
            throw new Error("User already exists with this email.");
          }
          const hashedPassword = credentials.password ? await bcrypt.hash(credentials.password, 10) : undefined;
          const adminEmails = ["shivansh.sharma9311@gmail.com", "khanyusuf2006@gmail.com"];
          const isAdmin = adminEmails.includes(credentials.email.toLowerCase());
          user = await LocalDB.createUser({
            name: credentials.name || credentials.email.split('@')[0],
            email: credentials.email,
            password: hashedPassword,
            role: isAdmin ? "admin" : "user",
            department: credentials.department || "General",
          });
        } else if (!user) {
          // If they don't exist and are trying to sign in, we can either error out or auto-provision.
          // Since the user wants a full registration form, we should error out on Sign In.
          throw new Error("Account not found. Please create an account first.");
        }
        
        const adminEmails = ["shivansh.sharma9311@gmail.com", "khanyusuf2006@gmail.com"];
        const isAdmin = adminEmails.includes(credentials.email.toLowerCase());
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: isAdmin ? "admin" : user.role,
          department: user.department,
        };
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        
        const cleanEmail = credentials.email.trim().toLowerCase();
        // Fetch user from local JSON database
        const user = await LocalDB.findUserByEmail(cleanEmail);
        
        if (!user) {
          throw new Error("Access Denied: No account found with this email. Please click Sign Up to register first.");
        }

        if (!user.password) {
          throw new Error("This account does not have a password set. Please sign in with OTP.");
        }
        
        // Validate password with bcrypt
        let isValidPassword = false;
        try {
          isValidPassword = await bcrypt.compare(credentials.password, user.password);
        } catch {
          isValidPassword = false;
        }
        
        if (!isValidPassword) {
          throw new Error("Incorrect password. Please verify and try again.");
        }
        
        const adminEmails = ["shivansh.sharma9311@gmail.com", "khanyusuf2006@gmail.com"];
        const isAdmin = adminEmails.includes(cleanEmail);
        const role = isAdmin ? "admin" : user.role;
        
        // Return user data for NextAuth session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: role,
          department: user.department
        };
      }
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev_12345",
  debug: true,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const cleanEmail = (user?.email || "").trim().toLowerCase();
        let existingUser = await LocalDB.findUserByEmail(cleanEmail);
        if (!existingUser) {
          // Auto-register the user if they don't exist
          const adminEmails = ["shivansh.sharma9311@gmail.com", "khanyusuf2006@gmail.com"];
          const isAdmin = adminEmails.includes(cleanEmail);
          existingUser = await LocalDB.createUser({
            name: user?.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            role: isAdmin ? "admin" : "user",
            department: "General",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // If user just logged in (via Google or OTP and it's not in DB, role might not be set yet)
      if (user) {
        // @ts-ignore
        token.role = user.role || "user";
        // @ts-ignore
        token.department = user.department || "General";
      }
      
      const cleanEmail = (token.email || "").trim().toLowerCase();
      const adminEmails = ["shivansh.sharma9311@gmail.com", "khanyusuf2006@gmail.com"];
      if (adminEmails.includes(cleanEmail)) {
        token.role = "admin";
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.department = token.department;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

