import { redirect } from "next/navigation";

export default function RootPage() {
  // Always first open the login page when visiting the root website link
  redirect("/login");
}
