import { Form, Link, useFetcher, useNavigation, useSubmit } from "@remix-run/react";
import IconArrowUp from "../Icons/IconArrowUp";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { cn, useParentData } from "~/lib/utils";
import type { User } from "~/db/db-schema";
import dayjs from "dayjs";
import { parseDate, parseName } from "~/models/helper";
import { useEffect, useTransition } from "react";

export type QuestionListItemProps = {
  id: string | number;
  votes: number;
  question: string;
  voterIds: number[];
  createdAt: string | null;
  questioner?: {
    id: number;
    name: string;
    googleId: string;
    email: string;
  };
};

export default function QuestionListItem(props: QuestionListItemProps) {
  const { user } = useParentData("routes/_landing") as { user: User | null };
  const isCurrentUserVoted = user ? props.voterIds.includes(user.id) : false;
  const actionVoteType = isCurrentUserVoted ? "DOWN_VOTES" : "UP_VOTES";

  const submit = useSubmit();

  const onVote = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) {
      window.localStorage.setItem(
        "vote",
        JSON.stringify({
          questionId: props.id,
          action: actionVoteType,
        })
      );
    }

    return submit(e.currentTarget);
  };

  return (
    <li>
      <article className="flex items-start w-full space-x-4">
        <Form onSubmit={onVote} method="post" action="/?index">
          <input type="hidden" name="question_id" value={props.id} />
          <input type="hidden" name="action" value={actionVoteType} />

          <button
            className={cn(
              "border rounded bg-gray-50 items-center flex flex-col justify-center min-w-[60px] py-4 font-semibold leading-140% space-y-[-2px] shadow relative",
              isCurrentUserVoted && "bg-emerald-50 border border-emerald-200"
            )}
          >
            <IconArrowUp />
            <span>{props.votes}</span>

            {<CheckBadgeIcon className="absolute w-5 h-5 -bottom-2.5 fill-emerald-600" />}
          </button>
        </Form>

        <Link to={`./${props.id}`} className="w-full">
          <div className="flex flex-col">
            <h2 className="font-semibold leading-140% mb-2 line-clamp-1">{props.question}</h2>
            <p className="text-sm leading-tight">{props.question}</p>

            <footer className="mt-3">
              <p className="text-slate-500 text-xs flex items-center">
                <span className="sr-only">Posted on</span>
                <time dateTime={parseDate(props.createdAt)}>{parseDate(props.createdAt, "DD MMMM YYYY HH:mm")}</time>
                <span className="w-1 h-1 mx-2 rounded-full bg-slate-200"></span>
                <span>@{parseName(props.questioner?.name)}</span>
              </p>
            </footer>
          </div>
        </Link>
      </article>
    </li>
  );
}
