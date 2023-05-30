import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { useState } from "react";
import IconLogin from "~/components/Icons/IconLogin";
import QuestionListItem from "~/components/ListPage/QuestionListItem";

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

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <header className="px-6 py-7 flex justify-between items-center bg-slate-100 border-b border-slate-200">
        <div>
          <h1 className="tracking-tighter leading-140% text-slate-900 text-2xl font-semibold">
            Tanya apa aja.
          </h1>
          <p className="-mt-[2px]">Helmi Satria</p>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="font-bold text-slate-800 py-2.5 px-3.5 rounded-full border border-slate-400 w-10 h-10 flex items-center justify-center"
            >
              H
            </button>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="flex py-1.5 px-2 items-center space-x-2"
            >
              <IconLogin />
              <span className="font-medium text-sm">Login</span>
            </button>
          )}
        </div>
      </header>

      <main className="px-6 py-5">
        <button>Buat pertanyaan baru</button>

        <ul className="space-y-5">
          {new Array(10).fill(0).map((_, i) => (
            <QuestionListItem key={i} />
          ))}
        </ul>
      </main>
    </>
  );
}
