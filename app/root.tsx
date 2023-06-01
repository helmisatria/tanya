import { type LinksFunction, type LoaderArgs } from "@remix-run/cloudflare";

import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import styles from "./tailwind.css";
import { GoogleStrategy } from "remix-auth-google";
import { authenticator } from "./services/auth.server";
import invariant from "tiny-invariant";

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

export async function loader({ request, context }: LoaderArgs) {
  invariant(context.AUTH_GOOGLE_CLIENT_ID, "Missing AUTH_GOOGLE_CLIENT_ID");
  invariant(context.AUTH_GOOGLE_CLIENT_SECRET, "Missing AUTH_GOOGLE_CLIENT_SECRET");
  invariant(context.AUTH_GOOGLE_CALLBACK_URL, "Missing AUTH_GOOGLE_CALLBACK_URL");

  let googleStrategy = new GoogleStrategy(
    {
      clientID: context.AUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: context.AUTH_GOOGLE_CLIENT_SECRET as string,
      callbackURL: context.AUTH_GOOGLE_CALLBACK_URL as string,
    },
    async ({ accessToken, refreshToken, extraParams, profile }) => {
      // Get the user data from your DB or API using the tokens and profile
      console.log({ profile });

      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      // return User.findOrCreate({ email: profile.emails[0].value });
    }
  );

  authenticator.use(googleStrategy);

  return {};
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
