"use client";

import { useCentreBookings, useCentreExpenses } from "@/lib/query-hooks";
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

export function Bookings({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    bookingId: true,
    patientId: true,
    name: true,
    age: true,
    gender: true,
    phone: true,
    submittedBy: true,
    consultant: true,
    modality: true,
    investigation: true,
    amount: true,
    discount: true,
    remark: true,
    extraCharge: true,
    paymentType: true,
  });

  const [loading, setLoading] = useState(false);
  const { data: dataCentreBookings, isLoading: IsLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const doesBookingMatchTerm = (booking: BookingDto, term: string) => {
    const loweredTerm = term.toLowerCase();

    // Iterate over each visible column
    for (const column in visibleColumns) {
      if (visibleColumns[column]) {
        // If the column is visible
        let value = booking[column]; // Get the booking's value for this column

        // For nested properties (like patient.name, patient.age, etc.)
        if (column === "name" && booking.patient) {
          value = booking.patient.name;
        }
        if (column === "age" && booking.patient) {
          value = booking.patient.age;
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

  const filteredBookings: BookingDto[] = dataCentreBookings?.data
    ? dataCentreBookings.data.filter((booking) =>
        doesBookingMatchTerm(booking, searchTerm)
      )
    : [];
  const sortedBookings = [...filteredBookings].sort((a, b) =>
    compareSortValues(a, b, sortField, sortDirection)
  );
  const handleSortChange = (value: string) => {
    setSortField(value);
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="w-full flex">
        <Link href={`/admin/centre/${centreId}/bookings/add`}>
          <Button className="bg-white text-black hover:opacity-80 ml-auto">
            Add New Booking
          </Button>
        </Link>{" "}
      </div>
      <div className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900">
        <div className="flex justify-between mb-4">
          {" "}
          <h3 className="text-xl font-bold  uppercase">All bookings Table</h3>
          <Input
            type="text"
            className="w-[300px] border border-zinc-600"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select defaultValue={sortField} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] border-zinc-600">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-600">
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="amount">Sort by Amount</SelectItem>
              <SelectItem value="createdAt">Sort by Created At</SelectItem>
              {/* Add other fields if you want */}
            </SelectContent>
          </Select>
          <DropdownMenuCheckboxes
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>
        <Table>
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
            {visibleColumns.amount && <TableHead>Amount</TableHead>}
            {visibleColumns.discount && <TableHead>Discount</TableHead>}
            {visibleColumns.remark && <TableHead>Remark</TableHead>}
            {visibleColumns.extraCharge && <TableHead>Extra Charges</TableHead>}
            {visibleColumns.paymentType && <TableHead>Payment Type</TableHead>}

            <TableHead className="text-right">Options</TableHead>
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
                  <TableCell>{booking.consultant}</TableCell>
                )}
                {visibleColumns.modality && (
                  <TableCell>{booking.modality}</TableCell>
                )}
                {visibleColumns.investigation && (
                  <TableCell>{booking.investigation}</TableCell>
                )}
                {visibleColumns.amount && (
                  <TableCell>{booking.amount}</TableCell>
                )}
                {visibleColumns.discount && (
                  <TableCell>{booking.discount}</TableCell>
                )}
                {visibleColumns.remark && (
                  <TableCell>{booking.remark}</TableCell>
                )}
                {visibleColumns.extraCharge && (
                  <TableCell>{booking.extraCharge}</TableCell>
                )}
                {visibleColumns.paymentType && (
                  <TableCell>{booking.paymentType}</TableCell>
                )}

                <TableCell className="space-x-4 text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    Delete
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
