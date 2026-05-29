import { format, parseISO } from "date-fns";

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

/** Date only, e.g. "29 May 2026". */
export function formatDate(value: string | Date): string {
  return format(toDate(value), "d MMM yyyy");
}

/** Date + time, e.g. "29 May 2026, 14:30". */
export function formatDateTime(value: string | Date): string {
  return format(toDate(value), "d MMM yyyy, HH:mm");
}
