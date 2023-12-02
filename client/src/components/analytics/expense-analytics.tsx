"use client";

import {
  useGetDoctorAnalytics,
  useUserData,
  useUserDetailData,
} from "@/lib/query-hooks";
import Nabvbar from "../navbar";
import { Card } from "../ui/card";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingDto, ExpenseDto } from "@/app/api/data-contracts";
import { convertAgeFromMonthsToYears, downloadCSV } from "@/lib/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";

const columns: ColumnDef<ExpenseDto>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    filterFn: "dateRangeFilter",
  },
  //   {
  //     accessorKey: "createdBy",
  //     header: "Created By",
  //     cell: ({ row }) => row.original.createdBy,
  //   },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount}`,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "expenseType",
    header: "Type",
    cell: ({ row }) => row.original.expenseType,
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => row.original.paymentMethod,
  },
];

// Rest of your component code...

export function ExpenseAnalyticsComponent({
  data,
}: {
  data: ExpenseDto[] | undefined;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 8, 20),
    to: addDays(new Date(2023, 8, 20), 120),
  });

  const dateRangeFilter = (
    row: any,
    columnId: any,
    filterValue: any,
    addDaysFunction: any
  ) => {
    if (!filterValue || !filterValue.from || !filterValue.to) {
      return true;
    }
    const rowValue = new Date(row.getValue(columnId));
    return (
      rowValue >= filterValue.from &&
      rowValue <= addDaysFunction(filterValue.to, 1)
    );
  };

  React.useEffect(() => {
    if (date) {
      setColumnFilters([{ id: "createdAt", value: date }]);
    }
  }, [date, setColumnFilters]);

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    filterFns: {
      dateRangeFilter: (row, columnId, filterValue) =>
        dateRangeFilter(row, columnId, filterValue, addDays),
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getReferralAmountThisMonth = (data: BookingDto[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // Note: January is 0, February is 1, and so on.

    // @ts-ignore
    return data?.reduce((sum: number, booking: ExpenseDto) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getFullYear() === currentYear &&
        bookingDate.getMonth() === currentMonth
        ? sum + booking?.amount!
        : sum;
    }, 0);
  };

  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState("");
  const handlePaymentMethodChange = (event: any) => {
    setPaymentMethodFilter(event);
    // Update the table filter
    setColumnFilters([
      ...columnFilters,
      { id: "paymentMethod", value: event == "all" ? "" : event },
    ]);
  };
  const PaymentMethodDropdown = () => {
    const uniquePaymentMethods = [
      //@ts-ignore
      ...new Set(data?.map((expense) => expense.paymentMethod)),
    ];
    return (
      <div className="flex gap-3">
        <Select
          value={paymentMethodFilter}
          onValueChange={handlePaymentMethodChange}
        >
          <SelectTrigger className="w-[180px] border border-blue-200 py-[6px] text-sm items-start rounded-md">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent className="bg-blue-100 border-blue-200">
            <SelectItem value="all">All</SelectItem>
            {uniquePaymentMethods.map((method) => (
              <SelectItem key={method} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  return (
    <div className="flex h-full flex-col gap-6 mt-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className="mb-2">Total Expenses Count</h2>
          <p className="font-bold text-xl  text-gray-700">{data?.length}</p>
        </div>
        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className=" mb-2">Total Expenses</h2>
          <p className="text-gray-700 text-xl font-bold">
            ₹{data?.reduce((sum, expense) => sum + expense.amount!, 0)}
          </p>
        </div>

        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className="mb-2">Referral Amount This Month</h2>
          <p className="font-bold text-xl  text-gray-700">
            ₹{getReferralAmountThisMonth(data)}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Filter analytics by name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DatePickerWithRange
            className="bg-blue-50"
            date={date}
            setDate={setDate}
          />
          <PaymentMethodDropdown />
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => downloadCSV(table.getRowModel().rows)}
          >
            Download CSV
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-blue-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
