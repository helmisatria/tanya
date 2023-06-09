import { type LinksFunction, type LoaderArgs } from "@remix-run/node";

import { Links, LiveReload, Meta, Outlet, Scripts, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { Toaster } from "sonner";

import styles from "./tailwind.css";
import { useEffect } from "react";

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
  return {
    ENV: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    },
  };
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
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GJGZSP9SR3"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-GJGZSP9SR3');
            `,
          }}
        ></script>
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
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GJGZSP9SR3"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-GJGZSP9SR3');
            `,
          }}
        ></script>
      </head>
      <body>
        <div className="max-w-lg mx-auto shadow min-h-screen bg-slate-50 bg-opacity-10">
          <Toaster position="bottom-center" />
          <Outlet />
        </div>
        {/* <ScrollRestoration /> */}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
