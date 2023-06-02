import dayjs from "dayjs";

export type HelperQuestion = {
  id: string;
  question: string;
  answer?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const parseDate = (date: string | null, format?: string) => {
  return dayjs(date)
    .add(7, "hours")
    .format(format ?? "YYYY-MM-DD HH:mm");
};

export const parseName = (name?: string | null) => {
  return String(name).toLowerCase().replace(/' '/g, ".");
};
