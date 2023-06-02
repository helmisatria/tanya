import { Form, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import Dialog from "~/components/shared/Dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { redirect, type ActionArgs } from "@remix-run/cloudflare";
import { cn, useParentData } from "~/lib/utils";
import { authenticator } from "~/services/auth.server";
import type { User } from "~/db/db-schema";
import { questions } from "~/db/db-schema";
import { db } from "~/root";

export async function action({ request }: ActionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return authenticator.authenticate("google", request);
  }

  const formData = await request.formData();
  const createdQuestion = await db
    .insert(questions)
    .values({
      question: formData.get("question") as string,
      questionerId: user.id,
    })
    .returning()
    .get();

  return redirect(`/${createdQuestion.id}`);
}

export default function LandingTanyaDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { user } = useParentData("routes/_landing") as { user: User | null };

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

  const submit = useSubmit();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!user) {
      window.localStorage.setItem("submitted_question", e.currentTarget.question.value);
    }

    return submit(e.currentTarget);
  };

  return (
    <Dialog open={dialogOpen} setOpen={setDialogOpen} onClose={onClose}>
      <div className="w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="leading-140% text-xl font-semibold">Tanya apa aja boleh.</h2>

          <button onClick={onClose} className="w-6 h-6">
            <XMarkIcon />
          </button>
        </div>

        <Form onSubmit={onSubmit} method="POST" className="flex flex-col items-end">
          <textarea
            rows={4}
            name="question"
            id="question"
            className="block w-full rounded-md border-0 py-3.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
            defaultValue={""}
            placeholder="Tulis pertanyaanmu disini..."
          />

          <button
            className={cn(
              "rounded-md mt-3 bg-slate-100 border border-slate-400 leading-140% px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200",
              navigation.state === "submitting" && "opacity-50 pointer-events-none"
            )}
          >
            {navigation.state === "submitting" ? "Saving..." : "Submit"}
          </button>
        </Form>
      </div>
    </Dialog>
  );
}
