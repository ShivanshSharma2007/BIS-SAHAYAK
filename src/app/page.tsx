import { redirect } from "next/navigation";

export default function RootPage() {
  // If user is not authenticated, middleware will intercept this and redirect to /login
  // If they are authenticated, they will correctly land on /dashboard
  redirect("/dashboard");
}
