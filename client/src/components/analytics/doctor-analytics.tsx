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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import { BookingDto } from "@/app/api/data-contracts";
import { amount, convertAgeFromMonthsToYears, downloadCSV } from "@/lib/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { BarList, DonutChart } from "@tremor/react";

const columns: ColumnDef<BookingDto>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    // @ts-ignore
    filterFn: "dateRangeFilter",
  },
  {
    accessorKey: "centreName",
    header: "Centre Name",
    cell: ({ row }) => row.original.centreName,
  },
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => row.original.patient?.name,
  },

  {
    accessorKey: "modality",
    header: "Modality",
    cell: ({ row }) => row.original.modality,
  },
  {
    accessorKey: "investigation",
    header: "Investigation",
    cell: ({ row }) => row.original.investigation,
  },
  {
    accessorKey: "totalAmount",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `₹${row.original.totalAmount}`,
  },
  {
    accessorKey: "referralAmount",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Referral Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `₹${row.original.referralAmount}`,
  },

  {
    accessorKey: "patient.age",
    header: "Patient Age",
    cell: ({ row }) => convertAgeFromMonthsToYears(row.original.patient?.age!),
  },
  {
    accessorKey: "patient.gender",
    header: "Patient Gender",
    cell: ({ row }) => row.original.patient?.gender,
  },
  // Add more columns as needed
];

export function DoctorAnalyticsComponent({
  data,
}: {
  data: BookingDto[] | undefined;
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

  return (
    <div className="flex h-full flex-col gap-6 mt-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className="mb-2">Referrals Booking Count</h2>
          <p className="font-bold text-xl  text-gray-700">{data?.length}</p>
        </div>
        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className=" mb-2">Total Referral Amount Earned</h2>
          <p className="text-gray-700 text-xl font-bold">
            {amount(
              table
                .getCoreRowModel()
                .flatRows.reduce(
                  (sum: number, booking) =>
                    sum + booking.original.referralAmount!,
                  0
                )
            )}
          </p>
        </div>

        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className="mb-2">Referral Amount in the selected period</h2>
          <p className="font-bold text-xl  text-gray-700">
            {amount(
              table
                .getRowModel()
                .flatRows.reduce(
                  (sum: number, booking) =>
                    sum + booking.original.referralAmount!,
                  0
                )
            )}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-blue-100 rounded-md p-4 mb-2">
          <h1>Modality Wise Count</h1>

          <BarList
            data={convertData(table.getRowModel().flatRows)}
            className="mt-2"
          />
        </div>
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Filter analytics by modality"
            value={
              (table.getColumn("modality")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("modality")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DatePickerWithRange
            className="bg-blue-50"
            date={date}
            setDate={setDate}
            placeholder="Filter bookings by date"
          />
          <Button
            variant="outline"
            className=""
            onClick={() => {
              setDate({ from: undefined, to: undefined });
            }}
          >
            Clear filter
          </Button>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => downloadCSV(table.getRowModel().rows)}
          >
            Download CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-blue-50" align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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

function convertData(data: any) {
  const modalityCount: { [key: string]: number } = {};

  data.forEach((item: any) => {
    const modality = item.original.modality;
    if (modalityCount[modality]) {
      modalityCount[modality]++;
    } else {
      modalityCount[modality] = 1;
    }
  });

  return Object.keys(modalityCount).map((key) => ({
    name: key,
    value: modalityCount[key],
  }));
}
