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
import { ExpenseDto } from "@/app/api/data-contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { centreexpense } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function Expenses({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    expenseId: true,
    expenseType: true,
    paymentMethod: true,
    amount: true,
    createdAt: false,
    date: true,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'
  const [sortField, setSortField] = useState("expenseId");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<ExpenseDto[]>([]);
  const [expensesUpdates, setExpensesUpdates] = useState({
    expenseId: "",
    expenseType: "",
    paymentMethod: "",
    amount: 0,
  });
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
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    // Sort
    result.sort((a, b) => {
      if (sortField === "createdAt" || sortField === "date") {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      } else if (sortField === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      } else {
        const fieldA = a[sortField as keyof ExpenseDto] as string;
        const fieldB = b[sortField as keyof ExpenseDto] as string;
        return sortOrder === "desc"
          ? fieldB?.localeCompare(fieldA)
          : fieldA?.localeCompare(fieldB);
      }
    });

    setFilteredData(result);
  }, [dataCentreExpenses, searchQuery, sortOrder, sortField]);

  const deleteExpense = async () => {
    try {
      if (!dataCentreExpenses?.data) {
        throw new Error("No data found");
      }

      setLoading(true);

      const response = await centreexpense.expenseControllerDelete(
        expensesUpdates.expenseId
      );

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["expenses", centreId]);
        toast({
          title: "Expense Deleted",
          variant: "default",
        });
        setLoading(false);
        setOpenDel(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      setLoading(false);
    }
  };
  const updateExpenses = async ({ e }: { e: any }) => {
    e.preventDefault();
    try {
      if (!dataCentreExpenses?.data) {
        throw new Error("No data found");
      }

      setLoading(true);

      const response = await centreexpense.expenseControllerUpdate({
        id: expensesUpdates.expenseId,
        centreId,
        expenseType: expensesUpdates.expenseType,
        paymentMethod: expensesUpdates.paymentMethod,
        amount: expensesUpdates.amount,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["expenses", centreId]);
        toast({
          title: "Expense Updated",
          variant: "default",
        });
        setLoading(false);
        setOpenEdit(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="w-full flex">
        <Link href={`/pr/${centreId}/expenses/add`}>
          <Button className="bg-blue-50 text-blue-950 hover:opacity-80 ml-auto border border-blue-200 shadow-none">
            Add New Expense
          </Button>
        </Link>{" "}
      </div>
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        <div className="flex justify-between mb-4 items-center">
          {" "}
          <h3 className="text-xl font-bold uppercase">Expenses</h3>
          <div className="w-[40vw]">
            <Input
              type="text"
              placeholder="Search expenses by expense type, payment method or amount"
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
          {dataCentreExpenses?.data.length == 0 && (
            <TableCaption className="py-6">
              No expenses added. <br />
              Add an expense to get started!{" "}
              <Link className="underline" href={`/pr/${centreId}/expenses/add`}>
                Here{" "}
              </Link>
            </TableCaption>
          )}
          <TableHeader>
            <TableRow>
              {visibleColumns.expenseId && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("expenseId");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Expense Id{" "}
                  {sortField === "expenseId" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.expenseType && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("expenseType");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Expense Type{" "}
                  {sortField === "expenseType" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.paymentMethod && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("paymentMethod");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Payment Method{" "}
                  {sortField === "paymentMethod" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.amount && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("amount");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Amount (in Rs.){" "}
                  {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.createdAt && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("createdAt");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Created At{" "}
                  {sortField === "createdAt" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.date && (
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortField("date");
                    sortOrder === "asc"
                      ? setSortOrder("desc")
                      : setSortOrder("asc");
                  }}
                >
                  Date{" "}
                  {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}

              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((expense, index) => (
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
                {visibleColumns.createdAt && (
                  <TableCell>
                    {new Date(expense.createdAt).toLocaleString()}
                  </TableCell>
                )}
                {visibleColumns.date && (
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell className="space-x-4 text-right">
                  <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExpensesUpdates({
                            expenseId: expense.id,
                            expenseType: expense.expenseType,
                            paymentMethod: expense.paymentMethod,
                            amount: expense.amount,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-blue-100 p-8">
                      <DialogHeader>
                        <DialogTitle>Edit expense</DialogTitle>
                        <DialogDescription>
                          Make changes to your expense here. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name">Expense Type</label>
                          <Input
                            id="name"
                            value={expensesUpdates.expenseType}
                            onChange={(e) => {
                              setExpensesUpdates({
                                ...expensesUpdates,
                                expenseType: e.target.value,
                              });
                            }}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="amount">Amount</label>
                          <Input
                            id="amount"
                            type="number"
                            value={expensesUpdates.amount}
                            onChange={(e) =>
                              setExpensesUpdates({
                                ...expensesUpdates,
                                amount: Number(e.target.value),
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="paymentMethod">Payment Method</label>
                          <Input
                            id="paymentMethod"
                            value={expensesUpdates.paymentMethod}
                            onChange={(e) =>
                              setExpensesUpdates({
                                ...expensesUpdates,
                                paymentMethod: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose>
                          <Button
                            type="button"
                            loading={loading}
                            onClick={(e) => {
                              updateExpenses({
                                e,
                              });
                            }}
                            className="bg-blue-50 border border-blue-200"
                          >
                            Save changes
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size={"sm"}
                        variant="outline"
                        onClick={() => {
                          setExpensesUpdates({
                            expenseId: expense.id,
                            expenseType: expense.expenseType,
                            paymentMethod: expense.paymentMethod,
                            amount: expense.amount,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your expense and all data for it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteExpense()}
                          className="bg-red-100"
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
