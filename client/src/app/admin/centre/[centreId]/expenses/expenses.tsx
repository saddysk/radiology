"use client";

import { useCentreExpenses } from "@/lib/query-hooks";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";

export function Expenses({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    expenseId: true,
    expenseType: true,
    paymentMethod: true,
    amount: true,
  });
  const [loading, setLoading] = useState(false);

  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [sortField, setSortField] = useState("expenseId");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { data: dataCentreExpenses, isLoading: IsLoadingCentreExpenses } =
    useCentreExpenses({
      centreId,
    });

  useEffect(() => {
    let result = [...(dataCentreExpenses?.data || [])];

    // Search
    if (searchQuery) {
      result = result.filter((expense) =>
        Object.values(expense).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      let comparison = 0;
      if (valA > valB) comparison = 1;
      if (valA < valB) comparison = -1;
      return sortOrder === "desc" ? comparison * -1 : comparison;
    });

    setFilteredData(result);
  }, [dataCentreExpenses, searchQuery, sortOrder, sortField]);

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
        <div className="flex justify-between mb-4">
          {" "}
          <h3 className="text-xl font-bold  uppercase">Expenses Table</h3>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </div>
          <DropdownMenuCheckboxes
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {/* Add onClick handlers to table headers for sorting */}
              {visibleColumns.expenseId && (
                <TableHead onClick={() => setSortField("expenseId")}>
                  Expense Id{" "}
                  {sortField === "expenseId" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.expenseType && (
                <TableHead onClick={() => setSortField("expenseType")}>
                  Expense Type{" "}
                  {sortField === "expenseType" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.paymentMethod && (
                <TableHead onClick={() => setSortField("paymentMethod")}>
                  Payment Method{" "}
                  {sortField === "paymentMethod" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.amount && (
                <TableHead onClick={() => setSortField("amount")}>
                  Amount (in Rs.){" "}
                  {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataCentreExpenses?.data.map((expense, index) => (
              <TableRow key={index}>
                {visibleColumns.expenseId && (
                  <TableCell>{expense.id}</TableCell>
                )}
                {visibleColumns.expenseType && (
                  <TableCell>{expense.expenseType}</TableCell>
                )}
                {visibleColumns.paymentMethod && (
                  <TableCell>{expense.paymentMethod}</TableCell>
                )}
                {visibleColumns.amount && (
                  <TableCell>{expense.amount}</TableCell>
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
