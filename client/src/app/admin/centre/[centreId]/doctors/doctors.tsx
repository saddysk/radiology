"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllDoctorsForCentreData } from "@/lib/query-hooks";
import { aggregateDoctorData } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function DoctorsList({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const {
    data: dataAllDoctorsForCentre,
    isLoading: isLoadingAllDoctorsForCentre,
  } = useGetAllDoctorsForCentreData({
    centreId,
    enabled: true,
  });

  const doctors =
    dataAllDoctorsForCentre?.data &&
    aggregateDoctorData(dataAllDoctorsForCentre.data);
  console.log(doctors, "here");

  const filteredDocs = doctors
    ? doctors.filter((doc) => doc.doctorName.toLowerCase().includes(searchTerm))
    : [];
  return (
    <div className="w-full p-8 overflow-y-scroll">
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        {" "}
        <div className="flex justify-between mb-4">
          {" "}
          <h3 className="text-xl font-bold  uppercase">Affiliated Doctors</h3>
          <Input
            type="text"
            className="w-[300px] border border-blue-200"
            placeholder="Search by patient name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr.No</TableHead>
              <TableHead>Doctor Id</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>XRAY (%)</TableHead>
              <TableHead>USG (%)</TableHead>
              <TableHead>CT-SCAN (%)</TableHead>
              <TableHead>Let Go on Commision</TableHead>

              {/* <TableHead className="text-right">XRAY</TableHead>
            <TableHead className="text-right">CT-SCAN</TableHead>
            <TableHead className="text-right">USG</TableHead>
            <TableHead className="text-right">Added On</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs?.map((doctor: any, index) => (
              <TableRow className="border-b-blue-200" key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{doctor?.doctorId}</TableCell>
                <TableCell>{doctor?.doctorName}</TableCell>
                <TableCell>{doctor["ct-scan"]}</TableCell>
                <TableCell>{doctor["usg"]}</TableCell>
                <TableCell>{doctor["x-ray"]}</TableCell>{" "}
                <TableCell>{doctor["letGo"] ? "Yes" : "No"}</TableCell>{" "}
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
