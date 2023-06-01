import { useMatches } from "@remix-run/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useParentData(id: string): unknown {
  let matches = useMatches();
  let parentMatch = matches.find((match) => match.id === id);
  if (!parentMatch) return null;
  return parentMatch.data;
}
