import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/services/auth.server";

export let loader = () => redirect("/");

export let action = ({ request }: ActionArgs) => {
  return authenticator.authenticate("google", request);
};
