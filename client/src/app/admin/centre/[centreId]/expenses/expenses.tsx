"use client";

import { useCentreExpenses } from "@/lib/query-hooks";
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

export function Expenses({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const { data: dataCentreExpenses, isLoading: IsLoadingCentreExpenses } =
    useCentreExpenses({
      centreId,
    });

  console.log(dataCentreExpenses, "here");
  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="w-full flex">
        <Link href={`/admin/centre/${centreId}/expenses/add`}>
          <Button className="bg-white text-black hover:opacity-80 ml-auto">
            Add New Expense
          </Button>
        </Link>{" "}
      </div>
      <div className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900">
        <h3 className="text-xl font-bold mb-4 uppercase">Expenses Table</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense Id</TableHead>
              <TableHead>Expense Type</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount (in Rs.)</TableHead>
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCentreExpenses?.data.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.id}</TableCell>
                <TableCell>{expense.expenseType}</TableCell>
                <TableCell>{expense.paymentMethod}</TableCell>
                <TableCell>{expense.amount}</TableCell>
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
