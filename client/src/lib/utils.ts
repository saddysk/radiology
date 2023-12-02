import { DoctorCommissionDto } from "@/app/api/data-contracts";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface IAgeInYears {
  years: number;
  months: number;
}

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

// export function aggregateDoctorData(data: DoctorCommissionDto[]) {
//   const result = []; // Initialize as an empty object

//   for (let entry of data) {

//     result.push({
//       id: entry.doctorId,
//       name: entry.doctor?.name,
//       modality: entry.modality,
//       amount: entry.amount,
//       letGo: entry.letGo,
//     });
//   }

//   return result;
// }

export function aggregateDoctorData(data: DoctorCommissionDto[] = []) {

  const result: any = {};

  // Iterate through the data array
  data.forEach(item => {
    const { doctorId, letGo, doctor, modality, amount } = item;
    const name = doctor?.name
    // Check if the doctorId is already in the result object
    if (!result[doctorId]) {
      // If not, initialize a new object for the doctor
      result[doctorId] = {
        doctorName: name,
      };
    }

    // Add the modality and amount to the doctor's data
    result[doctorId][modality] = amount;
    result[doctorId].letGo = letGo;
  });

  // Convert the result object into an array of objects
  const finalResult = Object.keys(result).map((doctorId) => ({
    doctorId,

    doctorName: result[doctorId].doctorName,
    ...result[doctorId],
  }));

  return finalResult;
}

export function convertAgeFromYearsToMonths(ageInYears: IAgeInYears): number {
  const { years, months } = ageInYears;
  const totalMonths = years * 12 + months;
  return totalMonths;
}

export function convertAgeFromMonthsToYears(ageInMonths: number): string {
  const years = Math.floor(ageInMonths / 12);
  const months = ageInMonths % 12;

  let yearString = years === 1 ? '1 yr' : `${years} yrs`;
  let monthString = months === 1 ? '1 m' : `${months} m`;

  if (years === 0 && months === 0) {
    return '0 m';
  } else if (years === 0) {
    return monthString;
  } else if (months === 0) {
    return yearString;
  } else {
    return `${yearString}, ${monthString}`;
  }
}

export function formatAge(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return { years, months: remainingMonths };
}

function replacer(key: string, value: any) {
  // Modify the value as needed
  if (value === null) {
    return "";
  }
  return value;
}

export function convertToCSV(data: Record<string, any>[]): string {
  const headers = Object.keys(data[0]);
  const csvRows = data.map(row =>
    headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
  );
  return [headers.join(','), ...csvRows].join('\r\n');
}

export function downloadCSV(rows: { original: Record<string, any> }[]): void {
  console.log(rows);
  const dataToDownload = rows.map(row => row.original);
  const csvData = convertToCSV(dataToDownload);
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'download.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


export const amount = (number: number) => `₹${number.toLocaleString()}`;

export const toTitleCase = (str: string) =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
