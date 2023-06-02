import type { ActionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { eq } from "drizzle-orm";
import { usersVotesQuestions } from "~/db/db-schema";
import { db } from "~/root";
import { authenticator } from "~/services/auth.server";

export default function Index() {
  return <></>;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect("/");
  }

  const action = formData.get("action");
  const questionId = formData.get("question_id") as string;

  if (!questionId) {
    throw new Error("Missing question id");
  }

  if (action === "UP_VOTES") {
    await db
      .insert(usersVotesQuestions)
      .values({
        questionId: Number(questionId),
        userId: user.id,
      })
      .onConflictDoNothing()
      .run();
  } else if (action === "DOWN_VOTES") {
    await db
      .delete(usersVotesQuestions)
      .where(eq(usersVotesQuestions.questionId, Number(questionId)))
      .run();
  }

  return {};
}
