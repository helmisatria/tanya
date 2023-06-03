import type { LoaderArgs } from "@remix-run/node";

import { eventStream } from "remix-utils";
import { getAllQuestions } from "~/models/questions";

export async function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    let timer = setInterval(async () => {
      const allQuestions = await getAllQuestions();

      send({ event: "questions", data: JSON.stringify(allQuestions) });
    }, 1000);

    return function clear() {
      clearInterval(timer);
    };
  });
}
