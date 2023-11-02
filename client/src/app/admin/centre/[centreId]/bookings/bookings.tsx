"use client";

import { useCentreBookings } from "@/lib/query-hooks";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenuCheckboxes } from "@/components/ui/dropdown-checkbox-custom";
import { BookingDto } from "@/app/api/data-contracts";
import { compareSortValues } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { ArrowDownIcon, ArrowUpIcon, IndianRupeeIcon } from "lucide-react";

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
    payment: true,
  });

  const [loading, setLoading] = useState(false);
  const { data: dataCentreBookings, isLoading: isLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
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
            {visibleColumns.payment && <TableHead>Payment</TableHead>}

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
                  <TableCell>{booking.patient?.age}</TableCell>
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
                {visibleColumns.payment && (
                  <TableCell>
                    {booking.payment?.map((payment) => (
                      <div key={payment.id} className="flex items-center">
                        <IndianRupeeIcon size={14} />
                        <div className="flex items-center gap-2">
                          <span>{payment.amount}</span>
                          <span>via</span>
                          <span>{payment.paymentType}</span>
                        </div>
                      </div>
                    ))}
                  </TableCell>
                )}

                <TableCell className="space-x-4 text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
