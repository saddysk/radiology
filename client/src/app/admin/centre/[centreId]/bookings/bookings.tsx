"use client";

import { useCentreBookings } from "@/lib/query-hooks";
import { ChangeEvent, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenuCheckboxes } from "@/components/ui/dropdown-checkbox-custom";
import { BookingDto } from "@/app/api/data-contracts";
import { compareSortValues, convertAgeFromMonthsToYears } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CenteredSpinner from "@/components/ui/centered-spinner";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Download,
  IndianRupeeIcon,
  Link2,
} from "lucide-react";
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
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { booking } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { record } from "zod";

export function Bookings({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState<{
    [key: string]: boolean;
  }>({
    bookingId: false,
    patientId: false,
    name: true,
    age: false,
    gender: false,
    phone: false,
    submittedBy: false,
    consultant: true,
    modality: true,
    investigation: true,
    remark: false,
    totalAmount: true,
    records: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<string | null>(null);
  const { data: dataCentreBookings, isLoading: isLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  const updateReport = async ({
    id,
    recordFile,
  }: {
    id: string;
    recordFile: string;
  }) => {
    try {
      setLoading(true);

      const response = await booking.bookingControllerUploadRecord({
        id,
        recordFile,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["booking", centreId]);
        toast({
          title: "Report added successfully",
          variant: "default",
        });
        setLoading(false);
        setOpenModal(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      setLoading(false);
      setOpenModal(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [fileUpload, setFileUpload] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result;

        if (base64Url && typeof base64Url === "string") {
          const base64 = base64Url.split(",")[1];
          setFileUpload(base64);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileUpload(null);
    }
  };

  const doesBookingMatchTerm = (booking: BookingDto, term: string) => {
    const loweredTerm = term.toLowerCase();

    // Iterate over each visible column
    for (const column in visibleColumns) {
      if (visibleColumns[column]) {
        // If the column is visible
        let value = booking[column as keyof BookingDto]; // Get the booking's value for this column

        // For nested properties (like patient.name, patient.age, etc.)
        if (column === "name" && booking.patient) {
          value = booking.patient.name;
        }
        if (column === "age" && booking.patient) {
          value = booking.patient.age.toString();
        }
        if (column === "gender" && booking.patient) {
          value = booking.patient.gender;
        }
        if (column === "phone" && booking.patient) {
          value = booking.patient.phone;
        }

        // Convert the value to string and check if it includes the term
        if (String(value).toLowerCase().includes(loweredTerm)) {
          return true; // Match found, no need to continue
        }
      }
    }

    return false; // No match found after checking all visible columns
  };

  if (isLoadingCentreBookings) {
    return <CenteredSpinner />;
  }

  const filteredBookings: BookingDto[] = dataCentreBookings?.data
    ? dataCentreBookings.data.filter((booking) =>
        doesBookingMatchTerm(booking, searchTerm)
      )
    : [];
  const sortedBookings = filteredBookings.sort((a, b) =>
    compareSortValues(a, b, sortField, sortDirection)
  );

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="w-full flex">
        <Link href={`/admin/centre/${centreId}/bookings/add`}>
          <Button className="bg-blue-50 text-blue-950 hover:opacity-80 ml-auto border border-blue-200 shadow-none">
            Add New Booking
          </Button>
        </Link>
      </div>
      <div className="p-6 my-4 rounded-lg bg-blue-100">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-bold">All bookings</h3>
          <Input
            type="text"
            className="w-[300px] border border-blue-200"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Select defaultValue={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[180px] border-blue-200">
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
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortDirection === "asc" ? (
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
          {dataCentreBookings?.data.length == 0 && (
            <TableCaption className="py-6">
              No bookings added. <br />
              Add a booking to get started!{" "}
              <Link
                className="underline"
                href={`/admin/centre/${centreId}/bookings/add`}
              >
                Here{" "}
              </Link>
            </TableCaption>
          )}
          <TableHeader>
            {visibleColumns.bookingId && <TableHead>Booking Id</TableHead>}
            {visibleColumns.patientId && <TableHead>Patient Id</TableHead>}
            {visibleColumns.name && <TableHead>Name</TableHead>}
            {visibleColumns.age && <TableHead>Age</TableHead>}
            {visibleColumns.gender && <TableHead>Gender</TableHead>}
            {visibleColumns.phone && <TableHead>Phone</TableHead>}
            {visibleColumns.submittedBy && <TableHead>Submitted By</TableHead>}
            {visibleColumns.consultant && <TableHead>Consultant</TableHead>}
            {visibleColumns.modality && <TableHead>Modality</TableHead>}
            {visibleColumns.investigation && (
              <TableHead>Investigation</TableHead>
            )}
            {visibleColumns.remark && <TableHead>Remark</TableHead>}
            {visibleColumns.totalAmount && <TableHead>Total Amount</TableHead>}
            {visibleColumns.records && <TableHead>Records</TableHead>}
            <TableHead className="text-right">More</TableHead>
          </TableHeader>
          <TableBody>
            {sortedBookings?.map((booking, index) => (
              <TableRow key={index}>
                {visibleColumns.bookingId && (
                  <TableCell>{booking.id}</TableCell>
                )}
                {visibleColumns.patientId && (
                  <TableCell>{booking.patientId}</TableCell>
                )}
                {visibleColumns.name && (
                  <TableCell>{booking.patient?.name}</TableCell>
                )}
                {visibleColumns.age && (
                  <TableCell>
                    {convertAgeFromMonthsToYears(booking.patient?.age!)}
                  </TableCell>
                )}
                {visibleColumns.gender && (
                  <TableCell>{booking.patient?.gender}</TableCell>
                )}
                {visibleColumns.phone && (
                  <TableCell>{booking.patient?.phone}</TableCell>
                )}
                {visibleColumns.submittedBy && (
                  <TableCell>{booking.submittedBy}</TableCell>
                )}
                {visibleColumns.consultant && (
                  <TableCell>{booking.consultantName}</TableCell>
                )}
                {visibleColumns.modality && (
                  <TableCell>{booking.modality}</TableCell>
                )}
                {visibleColumns.investigation && (
                  <TableCell>{booking.investigation}</TableCell>
                )}
                {visibleColumns.remark && (
                  <TableCell>{booking.remark || "-"}</TableCell>
                )}
                {visibleColumns.totalAmount && (
                  <TableCell className="flex items-center">
                    <IndianRupeeIcon size={14} />
                    {booking.totalAmount}
                  </TableCell>
                )}
                {visibleColumns.records && (
                  <TableCell>
                    {booking.records
                      ?.filter((record) => record.type == "prescription")
                      .map((record, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Download size={14} />
                          <div className="flex items-center gap-2">
                            <a href={record.url} className="capitalize">
                              {index + 1}. {record.type}
                            </a>
                          </div>
                        </div>
                      ))}
                    {booking.records
                      ?.filter((record) => record.type == "report")
                      .map((record, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Download size={14} />
                          <div className="flex items-center gap-2">
                            <a href={record.url} className="capitalize">
                              {index + 1}. {record.type}
                            </a>
                          </div>
                        </div>
                      ))}
                  </TableCell>
                )}

                <TableCell className="space-x-4 text-right">
                  <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border border-blue-300"
                        onClick={() => {
                          setCurrentBooking(booking.id);
                        }}
                      >
                        Upload Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-blue-50 p-8 gap-12">
                      <DialogHeader>
                        <DialogTitle>Upload Report Files here</DialogTitle>
                        <DialogDescription>
                          You can upload any booking related report, results
                          here.
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <Input
                          type="file"
                          className="bg-blue-100"
                          id="prescription"
                          onChange={handleFileChange}
                          name="recordFile"
                          accept=".pdf"
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          loading={loading}
                          onClick={() => {
                            console.log(booking.id, currentBooking);
                            updateReport({
                              id: currentBooking!,
                              recordFile: fileUpload!,
                            });
                          }}
                          className="bg-blue-200"
                        >
                          Upload
                        </Button>
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
