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
import { useAllConnectedCentresData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { ratelist } from "./rate_list_data";
export function RateList({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    data: dataAllConnectedCentres,
    isLoading: isLoadingAllConnectedCentres,
  } = useAllConnectedCentresData({
    enabled: true,
  });
  return (
    <div className="w-full p-8 overflow-y-scroll">
      <h1>Rate Lists</h1>
      <h2>X-RAY Rate List</h2>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sr.No</TableHead>
            <TableHead>Investigations</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-right">No. of films</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratelist["XRAY_rate_List"].map((item, index) => (
            <TableRow>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.investigations}</TableCell>
              <TableCell className="text-right">{item.rate}</TableCell>
              <TableCell className="text-right">{item.film_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
