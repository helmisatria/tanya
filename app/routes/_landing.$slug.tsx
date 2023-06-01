import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Dialog from "~/components/shared/Dialog";
import { ChevronDoubleUpIcon, XMarkIcon } from "@heroicons/react/24/outline";

import type { ActionArgs } from "@remix-run/cloudflare";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  console.log(formData.get("question"));

  // fake loading 1s
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    question: formData.get("question"),
  };
}

export default function LandingTanyaDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <Dialog open={dialogOpen} setOpen={setDialogOpen} onClose={onClose}>
      <div className="w-full">
        <header className="flex items-start justify-between mb-5">
          <button className="border text-3xl rounded bg-white items-center flex flex-col justify-center px-[18px] py-2 font-semibold leading-140% space-y-[-4px]  ">
            <ChevronDoubleUpIcon />
            <span>{Math.floor(Math.random() * 100)}</span>
          </button>

          <button onClick={onClose} autoFocus className="w-6 h-6">
            <XMarkIcon />
          </button>
        </header>

        <div className="mb-2">
          <p className="text-slate-500 text-xs flex items-center">
            <span className="sr-only">Posted on</span>
            <time dateTime="2015-05-16 19:00">29 Mei 2023</time>
            <span className="w-1 h-1 mx-2 rounded-full bg-slate-200"></span>
            <span>@helmi.satria</span>
          </p>
          <h2 className="mt-1 text-lg max-w-[14rem] leading-140% font-semibold">
            Mas, caranya bikin iilustrasinya gimana?
          </h2>

          <p className="mt-4 text-slate-800">
            Mas, caranya bikin ilustrasinya gimana? Sama record video nya pake
            apa ya?
          </p>
        </div>
      </div>
    </Dialog>
  );
}
