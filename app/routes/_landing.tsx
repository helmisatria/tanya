import { type V2_MetaFunction } from "@remix-run/node";
import IconLogin from "~/components/Icons/IconLogin";
import QuestionListItem from "~/components/ListPage/QuestionListItem";
import { Form, Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";

import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { getAllQuestions } from "~/models/questions";
import { useEventSource } from "remix-utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Tanya | Helmisatria.com" },
    {
      name: "description",
      content:
        "Meet Tanya, a passionate individual sharing insights and experiences on Helmisatria.com. Join Tanya's journey and discover a world of possibilities with 5+ years of expertise in fullstack javascript development",
    },
  ];
};

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);

  const questionsWithVotes = await getAllQuestions();

  return {
    user,
    questions: JSON.stringify(questionsWithVotes),
  };
}

export default function Index() {
  const { user, questions: loaderQuestions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const logout = async () => {
    navigate("/auth/logout");
  };

  let questionsString = useEventSource("/sse/questions", { event: "questions" }) ?? loaderQuestions;
  const questions = JSON.parse(questionsString) as Awaited<ReturnType<typeof getAllQuestions>>;

  return (
    <>
      <header className="px-6 py-7 flex justify-between items-center bg-slate-100 border-b border-slate-200">
        <div>
          <h1 className="tracking-tighter leading-140% text-slate-900 text-2xl font-semibold">Tanya apa aja.</h1>
          <p className="-mt-[2px]">Helmi Satria</p>
        </div>

        <div>
          {user ? (
            <button
              onClick={logout}
              className="font-bold text-slate-800 py-2.5 px-3.5 rounded-full border border-slate-400 w-10 h-10 flex items-center justify-center bg-white"
            >
              {user.name[0].toUpperCase()}
            </button>
          ) : (
            <Form action="/auth/google" method="post">
              <button className="flex py-1.5 px-2 items-center space-x-2">
                <IconLogin />
                <span className="font-medium text-sm">Login</span>
              </button>
            </Form>
          )}
        </div>
      </header>

      <main className="px-6 py-5">
        <Link
          tabIndex={0}
          to="./tanya"
          className="border font-semibold border-dashed leading-140% justify-center border-gray-400 shadow-sm rounded-lg py-5 w-full flex items-center"
          style={{
            background: "linear-gradient(180deg, #F9FAFB 50.79%, rgba(249, 250, 251, 0) 100%)",
          }}
        >
          Buat pertanyaan baru
        </Link>

        <ul className="mt-5 relative space-y-3">
          {questions.map((question) => {
            return (
              <li key={question.id}>
                <QuestionListItem {...question} />
              </li>
            );
          })}
        </ul>
      </main>
      <Outlet />
    </>
  );
}
