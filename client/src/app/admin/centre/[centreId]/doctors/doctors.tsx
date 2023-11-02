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

  const doctors =
    dataAllDoctorsForCentre?.data &&
    aggregateDoctorData(dataAllDoctorsForCentre.data);

  return (
    <div className="w-full p-8 overflow-y-scroll">
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        {" "}
        <div className="flex justify-between mb-4">
          {" "}
          <h3 className="text-xl font-bold  uppercase">Affiliated Doctors</h3>
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
            {doctors?.map((doctor: any, index) => (
              <TableRow className="border-b-blue-200" key={index}>
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
