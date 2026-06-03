import { redirect } from "next/navigation";

// Self-service website assets disabled — products are delivered manually
// by the admin. Send users to their order history.
export default function UserWebsiteAssetsPage() {
  redirect("/dashboard/user/purchases");
}
