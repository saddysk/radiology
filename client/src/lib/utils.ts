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
  sortDirection: "asc" | "desc"
) {
  // Function to get nested property value by a string path
  const getNestedValue = (obj: any, path: string) => {
    const parts = path.split(".");
    let value = obj;
    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  };

  // If the field is a date field
  if (sortField === "createdAt" || sortField === "updatedAt") {
    const dateA = new Date(getNestedValue(a, sortField));
    const dateB = new Date(getNestedValue(b, sortField));
    return sortDirection === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  }

  // If the field is a number field
  if (
    typeof getNestedValue(a, sortField) === "number" &&
    typeof getNestedValue(b, sortField) === "number"
  ) {
    return sortDirection === "asc"
      ? getNestedValue(a, sortField) - getNestedValue(b, sortField)
      : getNestedValue(b, sortField) - getNestedValue(a, sortField);
  }

  // Default to string comparison
  return sortDirection === "asc"
    ? getNestedValue(a, sortField).localeCompare(getNestedValue(b, sortField))
    : getNestedValue(b, sortField).localeCompare(getNestedValue(a, sortField));
}
