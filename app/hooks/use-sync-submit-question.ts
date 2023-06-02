import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

export const useSyncUnauthenticatedSubmitQuestion = () => {
  const fetcher = useFetcher();

  useEffect(() => {
    const storageKey = "submitted_question";
    const submittedQuestion = localStorage.getItem(storageKey);

    if (submittedQuestion) {
      localStorage.removeItem(storageKey);

      setTimeout(() => {
        fetcher.submit(
          { question: submittedQuestion },
          {
            method: "POST",
            action: "/tanya",
          }
        );
      }, 150);
    }
  }, []);
};
