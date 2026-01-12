import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export type Timestamp = {
	seconds: number;
	nanoseconds: number;
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function formatFirestoreTimestamp(timestamp: Timestamp): string {
	const date = new Date(timestamp.seconds * 1000);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export const formatDateString = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
  });
};