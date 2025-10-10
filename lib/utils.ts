import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function getCurrentTerm(terms: Term[]): Term | null {
  if (!terms || terms.length === 0) return null;

  const now = new Date();

  // Find term containing current date
  const currentTerm = terms.find((term) => {
    const startDate = new Date(term.startDate);
    const endDate = new Date(term.endDate);
    return now >= startDate && now <= endDate;
  });

  if (currentTerm) return currentTerm;

  // Find next upcoming term
  const upcomingTerms = terms
    .filter((term) => new Date(term.startDate) > now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return upcomingTerms[0] || terms[0] || null;
}
