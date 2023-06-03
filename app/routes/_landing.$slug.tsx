import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Dialog from "~/components/shared/Dialog";
import { ChevronDoubleUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { User } from "~/db/db-schema";
import { questions, users, usersVotesQuestions } from "~/db/db-schema";
import { eq } from "drizzle-orm";
import { cn, useParentData } from "~/lib/utils";
import { parseDate, parseName } from "~/models/helper";
import { db } from "~/services/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const questionId = (params.slug as string).split("-")[0] as string;
  if (!questionId) {
    return redirect("/");
  }

  const promiseQuestion = db
    .select()
    .from(questions)
    .where(eq(questions.id, Number(questionId)))
    .get();

  const promiseVoters = db
    .select()
    .from(usersVotesQuestions)
    .where(eq(usersVotesQuestions.questionId, Number(questionId)))
    .all();

  const [question, voters] = await Promise.all([promiseQuestion, promiseVoters]);

  const voter = await db.select().from(users).where(eq(users.id, question.questionerId)).get();

  const voterIds = voters.map((voter) => voter.userId);
  const votes = voters.length;

  return json({
    ...question,
    votes,
    voterIds,
    voter,
  });
}

export default function LandingTanyaDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useParentData("routes/_landing") as { user: User | null };

  const navigate = useNavigate();
  const { question, votes, voterIds, id, voter, createdAt } = useLoaderData<typeof loader>();

  const isCurrentUserVoted = user ? voterIds.includes(user.id) : false;
  const actionVoteType = isCurrentUserVoted ? "DOWN_VOTES" : "UP_VOTES";

  const fetcher = useFetcher();

  useEffect(() => {
    setTimeout(() => {
      setDialogOpen(true);
    }, 100);
  }, []);

  const onClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      navigate("/");
    }, 150);
  };

  const onVote = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) {
      window.localStorage.setItem(
        "vote",
        JSON.stringify({
          questionId: id,
          action: actionVoteType,
        })
      );
    }

    return fetcher.submit(e.currentTarget);
  };

  return (
    <Dialog open={dialogOpen} setOpen={setDialogOpen} onClose={onClose}>
      <div className="w-full">
        <header className="flex items-start justify-between mb-5">
          <fetcher.Form onSubmit={onVote} method="post" action="/?index">
            <input type="hidden" name="question_id" value={id} />
            <input type="hidden" name="action" value={actionVoteType} />

            <button
              className={cn(
                "relative border text-3xl rounded bg-white items-center flex flex-col justify-center min-w-[64px] py-2 font-semibold leading-140% space-y-[-4px]",
                isCurrentUserVoted && "bg-emerald-50 border border-emerald-200"
              )}
            >
              <ChevronDoubleUpIcon className="w-6 h-6 text-slate-700" />
              <span>{votes}</span>

              <CheckBadgeIcon className="absolute w-6 h-6 -bottom-3 fill-emerald-600" />
            </button>
          </fetcher.Form>

          <button onClick={onClose} autoFocus className="w-6 h-6">
            <XMarkIcon />
          </button>
        </header>

        <div className="mb-2">
          <p className="text-slate-500 text-xs flex items-center">
            <span className="sr-only">Posted on</span>
            <time dateTime={parseDate(createdAt)}>{parseDate(createdAt, "DD MMMM YYYY HH:mm")}</time>
            <span className="w-1 h-1 mx-2 rounded-full bg-slate-200"></span>
            <span>@{parseName(voter.name)}</span>
          </p>
          <h2 className="mt-1 text-lg max-w-[14rem] leading-140% font-semibold">{question}</h2>

          <p className="mt-4 text-slate-800">{question}</p>
        </div>
      </div>
    </Dialog>
  );
}
