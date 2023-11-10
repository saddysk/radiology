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
import { convertAgeFromMonthsToYears, downloadCSV } from "@/lib/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

const columns: ColumnDef<BookingDto>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    // @ts-ignore
    filterFn: "dateRangeFilter",
  },
  {
    accessorKey: "centreId",
    header: "Centre ID",
    cell: ({ row }) => row.original.centreId,
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

export function DoctorAnalyticsComponent() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: dataUser, isLoading: isLoadingAllUser } = useUserDetailData();
  const { data: dataDoctorAnalytics, isLoading: isDoctorAnalyticsLoading } =
    useGetDoctorAnalytics({
      doctorId: dataUser?.data.id!,
      enabled: dataUser?.data.id ? true : false,
    });

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
    data: dataDoctorAnalytics?.data || [],
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

    return data?.reduce((sum: number, booking: BookingDto) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.getFullYear() === currentYear &&
        bookingDate.getMonth() === currentMonth
        ? sum + booking?.referralAmount!
        : sum;
    }, 0);
  };
  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <Nabvbar />

      <div className="flex h-full flex-col">
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className="mb-2">Total Referrals Booking</h2>
            <p className="font-bold text-xl  text-gray-700">
              {dataDoctorAnalytics?.data.length}
            </p>
          </div>
          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className=" mb-2">Total Referral Amount Earned</h2>
            <p className="text-gray-700 text-xl font-bold">
              ₹
              {dataDoctorAnalytics?.data?.reduce(
                (sum, booking) => sum + booking?.referralAmount!,
                0
              )}
            </p>
          </div>

          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className="mb-2">Referral Amount This Month</h2>
            <p className="font-bold text-xl  text-gray-700">
              ₹{getReferralAmountThisMonth(dataDoctorAnalytics?.data!)}
            </p>
          </div>
        </div>

        <div className="w-full p-6">
          <div className="flex items-center py-4 gap-4">
            <Input
              placeholder="Filter emails..."
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
            />

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
        </div>
      </div>
    </Card>
  );
}
