import type { ActionArgs } from "@remix-run/cloudflare";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: ActionArgs) {
  await authenticator.logout(request, { redirectTo: "/" });
}

export default function Logout() {
  return <></>;
}
