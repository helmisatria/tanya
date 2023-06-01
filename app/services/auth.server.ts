// app/services/auth.server.ts
import { LoaderArgs } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import invariant from "tiny-invariant";
import { users } from "~/db/db-schema";
import { db } from "~/root";
import { sessionStorage } from "~/services/session.server";

export type User = {
  id: string;
  name: string;
  email: string;
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

export const registerGoogleStrategy = (context: LoaderArgs["context"]) => {
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

      await db
        .insert(users)
        .values([{ email: "satriahelmi@gmail.com", name: "Helmi Satria" }])
        .onConflictDoNothing()
        .run();

      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      // return User.findOrCreate({ email: profile.emails[0].value });
    }
  );

  authenticator.use(googleStrategy);
};
