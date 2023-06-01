import { type LinksFunction, type LoaderArgs } from "@remix-run/cloudflare";

import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";

import styles from "./tailwind.css";
import { registerGoogleStrategy } from "./services/auth.server";
import { registerDbClient } from "./services/db.server";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export let db: DrizzleD1Database;

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "stylesheet", href: styles },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    attributes: { crossorigin: "" },
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap",
  },
];

export async function loader({ context }: LoaderArgs) {
  db = registerDbClient(context);
  registerGoogleStrategy(context);

  return {};
}

export function ErrorBoundary(error: any) {
  console.error(error?.message);

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="max-w-lg mx-auto shadow min-h-screen bg-slate-50 bg-opacity-10">
          <Outlet />
        </div>
        {/* <ScrollRestoration /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
