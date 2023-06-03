import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader = async ({ request }: LoaderArgs) => {
  // Wait for 100 milliseconds to ensure the authenticator is ready since the loader runs in parallel.
  // Remove this after remix have pre-hook feature.
  await new Promise((resolve) => setTimeout(resolve, 100));

  return authenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
};
