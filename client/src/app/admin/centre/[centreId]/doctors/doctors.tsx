"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useAllConnectedCentresData,
  useGetAllDoctorsForCentreData,
} from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { DropdownMenuCheckboxes } from "../bookings/bookings";

export function DoctorsList({ centreId }: { centreId: string }) {
  const { toast } = useToast();

  const router = useRouter();
  const {
    data: dataAllDoctorsForCentre,
    isLoading: isLoadingAllDoctorsForCentre,
  } = useGetAllDoctorsForCentreData({
    centreId,
    enabled: true,
  });
  console.log(dataAllDoctorsForCentre, "dataAllDoctorsForCentre");

  function aggregateDoctorData(data = []) {
    let result = {};

    for (let entry of data) {
      const doctorId = entry.doctorId;
      const modality = entry.modality;
      const amount = entry.amount;

      // If doctor doesn't exist in the result, add them
      if (!result[doctorId]) {
        result[doctorId] = {
          doctor: entry.doctor,
        };
      }

      // Convert modality names to proper case for the output format
      const modalityName = modality.charAt(0).toUpperCase() + modality.slice(1);

      // Add the modality and amount to the doctor entry
      result[doctorId][modalityName] = amount;
    }

    // Convert the result to an array format
    return Object.values(result);
  }

  const doctors = aggregateDoctorData(dataAllDoctorsForCentre?.data);
  return (
    <div className="w-full p-8 overflow-y-scroll">
      <div className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900">
        {" "}
        <div className="flex justify-between mb-4">
          {" "}
          <h3 className="text-xl font-bold  uppercase">Expenses Table</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr.No</TableHead>
              <TableHead>Doctors</TableHead>
              <TableHead>XRAY</TableHead>
              <TableHead>USG</TableHead>
              <TableHead>CT-SCAN</TableHead>

              {/* <TableHead className="text-right">XRAY</TableHead>
            <TableHead className="text-right">CT-SCAN</TableHead>
            <TableHead className="text-right">USG</TableHead>
            <TableHead className="text-right">Added On</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors?.map((doctor, index) => (
              <TableRow className="border-b-zinc-600">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{doctor?.doctor?.name}</TableCell>
                <TableCell>{doctor["Ct-scan"]}</TableCell>
                <TableCell>{doctor["Usg"]}</TableCell>
                <TableCell>{doctor["X-ray"]}</TableCell>{" "}
                {/* <TableCell className="text-right">{item.rate}</TableCell>
              <TableCell className="text-right">{item.film_count}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
