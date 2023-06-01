import { Link } from "@remix-run/react";
import IconArrowUp from "../Icons/IconArrowUp";

export type QuestionListItemProps = {
  id: string | number;
  votes: number;
};

export default function QuestionListItem(props: QuestionListItemProps) {
  return (
    <li>
      <article className="flex items-start space-x-4">
        <button className="border rounded bg-gray-50 items-center flex flex-col justify-center px-5 py-4 font-semibold leading-140% space-y-[-2px] shadow">
          <IconArrowUp />
          <span>{props.votes}</span>
        </button>

        <Link to={`./${props.id}`}>
          <div className="flex flex-col">
            <h2 className="font-semibold leading-140% mb-2 line-clamp-1">
              Mas, cara bikin ilustrasi longer text should be truncated
            </h2>
            <p className="text-sm leading-tight">
              Mas, cara bikin ilustrasi di videonya gimana caranya?
            </p>

            <footer className="mt-3">
              <p className="text-slate-500 text-xs flex items-center">
                <span className="sr-only">Posted on</span>
                <time dateTime="2015-05-16 19:00">29 Mei 2023</time>
                <span className="w-1 h-1 mx-2 rounded-full bg-slate-200"></span>
                <span>@helmi.satria</span>
              </p>
            </footer>
          </div>
        </Link>
      </article>
    </li>
  );
}
