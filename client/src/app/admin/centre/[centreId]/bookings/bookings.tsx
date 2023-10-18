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

export function Bookings({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const { data: dataCentreBookings, isLoading: IsLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  console.log(dataCentreBookings, "here");
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
        <h3 className="text-xl font-bold mb-4 uppercase">All bookings Table</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Id</TableHead>
              <TableHead>Patient Id</TableHead>

              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>

              <TableHead>Submitted By</TableHead>
              <TableHead>Consultant</TableHead>
              <TableHead>Modality</TableHead>
              <TableHead>Investigation</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Remark</TableHead>
              <TableHead>Extra Charges</TableHead>
              <TableHead>Payment Type</TableHead>

              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCentreBookings?.data.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.patientId}</TableCell>
                <TableCell>{booking.patient?.name}</TableCell>
                <TableCell>{booking.patient?.age}</TableCell>
                <TableCell>{booking.patient?.gender}</TableCell>
                <TableCell>{booking.patient?.phone}</TableCell>

                <TableCell>{booking.submittedBy}</TableCell>
                <TableCell>{booking.consultant}</TableCell>
                <TableCell>{booking.modality}</TableCell>
                <TableCell>{booking.investigation}</TableCell>
                <TableCell>{booking.amount}</TableCell>
                <TableCell>{booking.discount}</TableCell>
                <TableCell>{booking.remark}</TableCell>
                <TableCell>{booking.extraCharge}</TableCell>
                <TableCell>{booking.paymentType}</TableCell>

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
