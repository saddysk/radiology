import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyText(entryText: string) {
  navigator.clipboard.writeText(entryText);
}

export function camelCaseToNormalText(str: string) {
  // Split the camelCased string into words using regex
  const result = str
    .replace(/([A-Z])/g, " $1")
    // Capitalize the first letter of each word
    .replace(/^./, (char) => char.toUpperCase())
    // Remove any leading spaces
    .trim();

  return result;
}

// Utility function to determine sort order
export function compareSortValues(
  a: any,
  b: any,
  sortField: string,
  sortDirection: "asc" | "desc",
) {
  // If the field is a date field
  if (sortField === "createdAt" || sortField === "updatedAt") {
    const dateA = new Date(a[sortField]);
    const dateB = new Date(b[sortField]);
    return sortDirection === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  }

  // If the field is a number field
  if (typeof a[sortField] === "number" && typeof b[sortField] === "number") {
    return sortDirection === "asc"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  }

  // Default to string comparison
  return sortDirection === "asc"
    ? a[sortField].localeCompare(b[sortField])
    : b[sortField].localeCompare(a[sortField]);
}
