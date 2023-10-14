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
  return (
    <div className="w-full p-8 overflow-y-scroll">
      <h1>Rate Lists</h1>
      <h2>X-RAY Rate List</h2>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr.No</TableHead>
            <TableHead>Doctors</TableHead>
            <TableHead className="text-right">Name</TableHead>

            {/* <TableHead className="text-right">XRAY</TableHead>
            <TableHead className="text-right">CT-SCAN</TableHead>
            <TableHead className="text-right">USG</TableHead>
            <TableHead className="text-right">Added On</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataAllDoctorsForCentre?.data.map((doctor, index) => (
            <TableRow className="border-b-zinc-600">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{doctor.doctor?.name}</TableCell>
              {/* <TableCell className="text-right">{item.rate}</TableCell>
              <TableCell className="text-right">{item.film_count}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
