// app/services/auth.server.ts
import { eq } from "drizzle-orm";
import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import invariant from "tiny-invariant";
import type { User } from "~/db/db-schema";
import { users } from "~/db/db-schema";
import { sessionStorage } from "~/services/session.server";

import { config } from "dotenv";
import { db } from "./db.server";
config();

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

invariant(process.env.AUTH_GOOGLE_CLIENT_ID, "Missing AUTH_GOOGLE_CLIENT_ID");
invariant(process.env.AUTH_GOOGLE_CLIENT_SECRET, "Missing AUTH_GOOGLE_CLIENT_SECRET");
invariant(process.env.AUTH_GOOGLE_CALLBACK_URL, "Missing AUTH_GOOGLE_CALLBACK_URL");

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.AUTH_GOOGLE_CALLBACK_URL as string,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile

    try {
      await db
        .insert(users)
        .values({ email: profile.emails[0].value, name: profile.displayName, googleId: profile.id })
        .onConflictDoNothing()
        .run();

      const user = await db.select().from(users).where(eq(users.email, profile.emails[0].value)).get();

      return {
        id: user.id,
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
    } catch (error) {
      console.error("error -->", error);

      return {
        id: 0,
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
    }
  }
);

authenticator.use(googleStrategy);
