import { type ActionArgs } from "@remix-run/cloudflare";
import { useFetcher } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { useEffect } from "react";
import { usersVotesQuestions } from "~/db/db-schema";
import { useSyncUnauthenticatedSubmitQuestion } from "~/hooks/use-sync-submit-question";
import { useSyncUnauthenticatedLastVotes } from "~/hooks/use-sync-votes";
import { db } from "~/root";
import { authenticator } from "~/services/auth.server";

export default function Index() {
  useSyncUnauthenticatedLastVotes();
  useSyncUnauthenticatedSubmitQuestion();

  return <></>;
}

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return authenticator.authenticate("google", request);
  }

  const formData = await request.formData();

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
