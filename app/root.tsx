import { type LinksFunction, type LoaderArgs } from "@remix-run/cloudflare";

import { Links, LiveReload, Meta, Outlet, Scripts, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Toaster } from "sonner";

import styles from "./tailwind.css";
import { registerGoogleStrategy } from "./services/auth.server";
import { registerDbClient } from "./services/db.server";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { useEffect } from "react";

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

const ErrorRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"></link>
      </head>
      <body>
        <main className="px-5">{children}</main>
      </body>
    </html>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorRoot>
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      </ErrorRoot>
    );
  } else if (error instanceof Error) {
    return (
      <ErrorRoot>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </ErrorRoot>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
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
        <Toaster />
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
