import { redirect } from "next/navigation";

// Software marketplace temporarily disabled.
// Redirect any visitor (direct URL, old link, category menu) to the home page.
export default function SoftwarePage() {
  redirect("/");
}
