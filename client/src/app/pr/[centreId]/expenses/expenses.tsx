"use client";

import { useCentreExpenses, useUserData } from "@/lib/query-hooks";
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
import { ExpenseDto, RequestType } from "@/app/api/data-contracts";
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
import { centreexpense, edit } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export function Expenses({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    expenseId: true,
    name: true,
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
  const [sortOrder, setSortOrder] = useState("desc"); // or 'asc'
  const [sortField, setSortField] = useState("expenseId");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<ExpenseDto[]>([]);
  const [expensesUpdates, setExpensesUpdates] = useState({
    expenseId: "",
    name: "",
    expenseType: "",
    paymentMethod: "",
    amount: 0,
  });
  const { data: dataCentreExpenses, isLoading: isLoadingCentreExpenses } =
    useCentreExpenses({
      centreId,
    });

  const { data: dataUser, isLoading: isLoadingAllUser } = useUserData({
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

      const currentExpense = dataCentreExpenses.data.find(
        (e) => e.id === expensesUpdates.expenseId
      );

      const response = await edit.updateRequestControllerSave({
        type: RequestType.Expense,
        expenseData: {
          id: expensesUpdates.expenseId,
          centreId,
          name: expensesUpdates.name,
          expenseType: expensesUpdates.expenseType,
          paymentMethod: expensesUpdates.paymentMethod,
          amount: expensesUpdates.amount,
          createdAt: currentExpense?.createdAt!,
          updatedAt: currentExpense?.updatedAt!,
          createdBy: currentExpense?.createdBy!,
          date: currentExpense?.date!,
        },
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["expenses", centreId]);
        toast({
          title: "Expense Update Requested",
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
        </Link>
      </div>
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        <div className="flex justify-between mb-4 items-center">
          <h3 className="text-xl font-bold uppercase">Expenses</h3>
          <div className="w-[25vw]">
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-52 border-blue-200">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-blue-100 border-blue-200">
                <SelectItem value="expenseId">Sort by Expense Id</SelectItem>
                <SelectItem value="date">Sort by Expense Date</SelectItem>
                {/* Add other fields if you want */}
              </SelectContent>
            </Select>
            <Button
              size="icon"
              variant="ghost"
              className="border border-blue-200"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              {sortOrder === "asc" ? (
                <ArrowUpIcon size={16} />
              ) : (
                <ArrowDownIcon size={16} />
              )}
            </Button>
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
              {visibleColumns.expenseId && <TableHead>Expense Id</TableHead>}
              {visibleColumns.name && <TableHead>Expense Name</TableHead>}
              {visibleColumns.expenseType && (
                <TableHead>Expense Type</TableHead>
              )}
              {visibleColumns.paymentMethod && (
                <TableHead>Payment Method</TableHead>
              )}
              {visibleColumns.amount && <TableHead>Amount (in Rs.)</TableHead>}
              {visibleColumns.createdAt && <TableHead>Created At</TableHead>}
              {visibleColumns.date && <TableHead>Expense Date</TableHead>}
              <TableHead className="text-right">Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData?.map((expense, index) => (
              <TableRow key={index}>
                {visibleColumns.expenseId && (
                  <TableCell>{expense.id}</TableCell>
                )}
                {visibleColumns.name && <TableCell>{expense.name}</TableCell>}
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
                            name: expense.name,
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
                          <label htmlFor="name">Expense Name</label>
                          <Input
                            id="name"
                            value={expensesUpdates.name}
                            onChange={(e) => {
                              setExpensesUpdates({
                                ...expensesUpdates,
                                name: e.target.value,
                              });
                            }}
                            className="col-span-3"
                          />
                        </div>

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
                            onWheel={(e: any) => e.target.blur()}
                            value={expensesUpdates.amount}
                            onChange={(e) => {
                              if (/^\d*\.?\d*$/.test(e.target.value)) {
                                setExpensesUpdates({
                                  ...expensesUpdates,
                                  amount: Number(e.target.value),
                                });
                              }
                            }}
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
                  {/* <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size={"sm"} variant="outline">
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
                  </AlertDialog> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
