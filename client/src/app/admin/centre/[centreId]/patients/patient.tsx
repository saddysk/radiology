"use client";

import { useGetPatients } from "@/lib/query-hooks";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenuCheckboxes } from "@/components/ui/dropdown-checkbox-custom";
import { Input } from "@/components/ui/input";
import { PatientDto } from "@/app/api/data-contracts";
import CenteredSpinner from "@/components/ui/centered-spinner";

export function Patient({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    patientNumber: true,
    abhaId: true,
    name: true,
    age: true,
    gender: true,
    phone: true,
    email: true,
    address: true,
  });
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [sortField, setSortField] = useState("patientNumber");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<PatientDto[]>([]);

  const { data: dataPatients, isLoading: isLoadingPatients } = useGetPatients({
    centreId,
  });

  // useEffect(() => {
  //   let result = [...(dataPatients?.data || [])];

  //   // Search
  //   if (searchQuery) {
  //     result = result.filter((patient) =>
  //       Object.values(patient).some((val) =>
  //         String(val).toLowerCase().includes(searchQuery.toLowerCase())
  //       )
  //     );
  //   }

  //   // Sort
  //   result.sort((a, b) => {
  //     if (sortField === "createdAt" || sortField === "date") {
  //       const dateA = new Date(a[sortField]);
  //       const dateB = new Date(b[sortField]);
  //       return sortOrder === "desc"
  //         ? dateB.getTime() - dateA.getTime()
  //         : dateA.getTime() - dateB.getTime();
  //     } else if (sortField === "amount") {
  //       return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
  //     } else {
  //       const fieldA = a[sortField as keyof ExpenseDto] as string;
  //       const fieldB = b[sortField as keyof ExpenseDto] as string;
  //       return sortOrder === "desc"
  //         ? fieldB?.localeCompare(fieldA)
  //         : fieldA?.localeCompare(fieldB);
  //     }
  //   });

  //   setFilteredData(result);
  // }, [dataPatients, searchQuery, sortOrder, sortField]);

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        <div className="flex justify-between mb-4 items-center">
          <h3 className="text-xl font-bold uppercase">Patients</h3>
          <div className="w-[40vw]">
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </div>
          <DropdownMenuCheckboxes
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>

        <Table>
          {isLoadingPatients ? (
            <TableCaption className="py-6">
              {" "}
              <CenteredSpinner />
            </TableCaption>
          ) : (
            dataPatients?.data.length == 0 && (
              <TableCaption className="py-6">No patient found!</TableCaption>
            )
          )}
          <TableHeader>
            <TableRow>
              {visibleColumns.patientNumber && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("patientNumber");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Patient Id{" "}
                  {sortField === "patientNumber" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.abhaId && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("abhaId");
                    ``;
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Abha Id{" "}
                  {sortField === "abhaId" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.name && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("name");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Name{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.age && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("age");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Age {sortField === "age" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.gender && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("gender");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Gender{" "}
                  {sortField === "gender" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.phone && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("phone");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Phone{" "}
                  {sortField === "phone" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.email && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("email");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Email{" "}
                  {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.address && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("address");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Address{" "}
                  {sortField === "address" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}

              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((patient, index) => (
              <TableRow key={index}>
                {visibleColumns.patientNumber && (
                  <TableCell>{patient.patientNumber}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
