"use client";

import { useGetPatients } from "@/lib/query-hooks";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

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
  const [sortOrder, setSortOrder] = useState("desc"); // or 'asc'
  const [sortField, setSortField] = useState("createdAt");
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
      <div className="p-6 my-4 rounded-lg bg-blue-100">
        <div className="flex justify-between mb-4 items-center">
          <h3 className="text-xl font-bold uppercase">Patients</h3>
          <div className="w-[25vw]">
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-52 border-blue-200">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-blue-100 border-blue-200">
                <SelectItem value="patient.name">Sort by Name</SelectItem>
                <SelectItem value="createdAt">Sort by Created At</SelectItem>
                {/* Add other fields if you want */}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              className="border border-blue-200"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? (
                <ArrowUpIcon size={16} />
              ) : (
                <ArrowDownIcon size={16} />
              )}
            </Button>
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
                <TableHead>Patient Id</TableHead>
              )}
              {visibleColumns.abhaId && <TableHead>Abha Id</TableHead>}
              {visibleColumns.name && <TableHead>Name</TableHead>}
              {visibleColumns.age && <TableHead>Age</TableHead>}
              {visibleColumns.gender && <TableHead>Gender</TableHead>}
              {visibleColumns.phone && <TableHead>Phone</TableHead>}
              {visibleColumns.email && <TableHead>Email</TableHead>}
              {visibleColumns.address && <TableHead>Address</TableHead>}
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
