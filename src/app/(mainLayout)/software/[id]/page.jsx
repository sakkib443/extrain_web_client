import { redirect } from "next/navigation";

// Software details temporarily disabled.
// Redirect any visitor (direct URL, old link) to the home page.
export default function SoftwareDetailsPage() {
  redirect("/");
}
