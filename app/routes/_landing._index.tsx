import { type ActionArgs } from "@remix-run/node";
import { and, eq } from "drizzle-orm";
import { questions, usersVotesQuestions } from "~/db/db-schema";
import { useNotifications } from "~/hooks/use-notifications";
import { useSyncUnauthenticatedSubmitQuestion } from "~/hooks/use-sync-submit-question";
import { useSyncUnauthenticatedLastVotes } from "~/hooks/use-sync-votes";
import { authenticator } from "~/services/auth.server";
import { db } from "~/services/db.server";

export default function Index() {
  useSyncUnauthenticatedLastVotes();
  useSyncUnauthenticatedSubmitQuestion();
  useNotifications();

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
      .where(
        and(
          // conditions
          eq(usersVotesQuestions.questionId, Number(questionId)),
          eq(usersVotesQuestions.userId, user.id)
        )
      )
      .run();
  } else if (action === "DELETE_QUESTION") {
    const isAdmin = process.env.ADMIN_EMAIL === user.email;

    if (!isAdmin) return {};

    await db
      .delete(usersVotesQuestions)
      .where(eq(usersVotesQuestions.questionId, Number(questionId)))
      .run();

    await db
      .delete(questions)
      .where(eq(questions.id, Number(questionId)))
      .run();
  }

  return {};
}
