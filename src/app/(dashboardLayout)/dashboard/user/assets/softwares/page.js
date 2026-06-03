import { redirect } from "next/navigation";

// Self-service software assets disabled — products are delivered manually
// by the admin. Send users to their order history.
export default function UserSoftwareAssetsPage() {
  redirect("/dashboard/user/purchases");
}
