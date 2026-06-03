import { redirect } from "next/navigation";

// Self-service downloads disabled — purchased products are now delivered
// manually by the admin (via email/WhatsApp). Send users to their order history.
export default function DownloadsPage() {
  redirect("/dashboard/user/purchases");
}
