"use client";

import { useGetPatients, useUpdatePatient } from "@/lib/query-hooks";
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
import { ExpenseDto, PatientDto } from "@/app/api/data-contracts";
import CenteredSpinner from "@/components/ui/centered-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import {
  convertAgeFromMonthsToYears,
  convertAgeFromYearsToMonths,
  formatAge,
} from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export function Patient({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    patientNumber: true,
    abhaId: false,
    name: true,
    age: true,
    gender: true,
    phone: true,
    email: true,
    address: true,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // or 'asc'
  const [sortField, setSortField] = useState<any>("createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<PatientDto[]>([]);
  const [patientUpdates, setPatientUpdates] = useState<any>({
    id: "",
    centreId: "",
    email: "",
    address: "",
    abhaId: "",
    name: "",
    age: {
      years: 0,
      months: 0,
    },
    gender: "",
    phone: "",
  });
  const { toast } = useToast();
  const { data: dataPatients, isLoading: isLoadingPatients } = useGetPatients({
    centreId,
  });

  console.log(dataPatients);
  useEffect(() => {
    let result = [...(dataPatients?.data || [])];

    // Search
    if (searchQuery) {
      result = result.filter((patient) =>
        Object.values(patient).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    result.sort((a: any, b: any) => {
      if (sortField === "createdAt" || sortField === "date") {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      } else if (sortField === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      } else {
        const fieldA = a[sortField as keyof ExpenseDto] as string;
        const fieldB = b[sortField as keyof ExpenseDto] as string;
        return sortOrder === "desc"
          ? fieldB?.localeCompare(fieldA)
          : fieldA?.localeCompare(fieldB);
      }
    });

    setFilteredData(result);
  }, [dataPatients, searchQuery, sortOrder, sortField]);

  const { mutate: updatePatient, isLoading: updatePatientLoading } =
    useUpdatePatient({
      centreId,
      data: {
        ...patientUpdates,
        age: convertAgeFromYearsToMonths(patientUpdates.age),
      },
      onSuccess: () => {
        toast({
          title: "Patient Details Updated",
          variant: "default",
        });
        setOpenEdit(false);
      },
    });

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
                {visibleColumns.abhaId && (
                  <TableCell>{patient.abhaId}</TableCell>
                )}
                {visibleColumns.name && <TableCell>{patient.name}</TableCell>}
                {visibleColumns.age && (
                  <TableCell>
                    {convertAgeFromMonthsToYears(patient.age)}
                  </TableCell>
                )}
                {visibleColumns.gender && (
                  <TableCell>{patient.gender}</TableCell>
                )}
                {visibleColumns.phone && <TableCell>{patient.phone}</TableCell>}
                {visibleColumns.email && <TableCell>{patient.email}</TableCell>}
                {visibleColumns.address && (
                  <TableCell>{patient.address}</TableCell>
                )}
                <TableCell className="text-right">
                  <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPatientUpdates({
                            id: patient.id,
                            centreId: patient.centreId,
                            email: patient.email,
                            address: patient.address,
                            abhaId: patient.abhaId,
                            name: patient.name,
                            age: formatAge(patient.age),
                            gender: patient.gender,
                            phone: patient.phone,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-blue-100 p-8">
                      <DialogHeader>
                        <DialogTitle>Edit Patient</DialogTitle>
                        <DialogDescription>
                          Update patient details here. Click save when done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Name */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name">Name</label>
                          <Input
                            id="name"
                            value={patientUpdates.name}
                            onChange={(e) =>
                              setPatientUpdates({
                                ...patientUpdates,
                                name: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        {/* Email */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="email">Email</label>
                          <Input
                            id="email"
                            value={patientUpdates.email}
                            onChange={(e) =>
                              setPatientUpdates({
                                ...patientUpdates,
                                email: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        {/* Address */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="address">Address</label>
                          <Input
                            id="address"
                            value={patientUpdates.address}
                            onChange={(e) =>
                              setPatientUpdates({
                                ...patientUpdates,
                                address: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        {/* ABHA ID */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="abhaId">ABHA ID</label>
                          <Input
                            id="abhaId"
                            value={patientUpdates.abhaId}
                            onChange={(e) =>
                              setPatientUpdates({
                                ...patientUpdates,
                                abhaId: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        {/* Age */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="ageYears">Age (Years)</label>
                          <Input
                            id="ageYears"
                            type="number"
                            onWheel={(e: any) => e.target.blur()}
                            value={patientUpdates.age.years}
                            onChange={(e) => {
                              if (/^\d*\.?\d*$/.test(e.target.value)) {
                                setPatientUpdates({
                                  ...patientUpdates,
                                  age: {
                                    ...patientUpdates.age,
                                    years: Number(e.target.value),
                                  },
                                });
                              }
                            }}
                            className="col-span-1"
                          />
                          <label htmlFor="ageMonths">Months</label>
                          <Input
                            id="ageMonths"
                            type="number"
                            onWheel={(e: any) => e.target.blur()}
                            value={patientUpdates.age.months}
                            onChange={(e) => {
                              if (/^\d*\.?\d*$/.test(e.target.value)) {
                                setPatientUpdates({
                                  ...patientUpdates,
                                  age: {
                                    ...patientUpdates.age,
                                    months: Number(e.target.value),
                                  },
                                });
                              }
                            }}
                            className="col-span-1"
                          />
                        </div>
                        {/* Gender */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="gender">Gender</label>
                          <Select
                            onValueChange={(value) => {
                              setPatientUpdates({
                                ...patientUpdates,
                                gender: value,
                              });
                            }}
                            defaultValue={patientUpdates.gender}
                          >
                            <SelectTrigger className="w-full border border-blue-200 bg-blue-50 shadow-none">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className=" border-blue-200 bg-blue-50">
                              <SelectItem value={"Male"} className="capitalize">
                                Male
                              </SelectItem>
                              <SelectItem
                                value={"Female"}
                                className="capitalize"
                              >
                                Female
                              </SelectItem>
                              <SelectItem value={"Null"} className="capitalize">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Phone */}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            loading={updatePatientLoading}
                            onClick={() => updatePatient()}
                            className="bg-blue-50 border border-blue-200"
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
