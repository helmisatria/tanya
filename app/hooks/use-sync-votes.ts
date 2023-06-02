import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const useSyncUnauthenticatedLastVotes = () => {
  const fetcher = useFetcher();

  useEffect(() => {
    const lastVoteString = localStorage.getItem("vote");
    const lastVote = lastVoteString
      ? (JSON.parse(lastVoteString) as {
          questionId: number;
          action: "UP_VOTES" | "DOWN_VOTES";
        })
      : null;

    if (lastVote) {
      localStorage.removeItem("vote");

      setTimeout(() => {
        fetcher.submit(
          { question_id: String(lastVote.questionId), action: lastVote.action },
          {
            method: "POST",
            action: "/?index",
          }
        );
      }, 150);
    }
  }, []);
};
