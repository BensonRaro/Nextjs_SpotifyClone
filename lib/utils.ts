import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DurationConverter = (seconds: number) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}: ${mm.toString().padStart(2, "0")} : ${ss}`;
  }
  return `${mm}:${ss}`;
};
