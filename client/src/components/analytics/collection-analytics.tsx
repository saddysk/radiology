"use client";

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

import { Button } from "@/components/ui/button";
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
import { amount, downloadCSV, toTitleCase } from "@/lib/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AreaChart, BarList, DonutChart } from "@tremor/react";

type Data = any;

export function CollectionAnalyticsComponent({
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

  const [date, setDate] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const db = React.useMemo(() => {
    if (data) {
      return data?.map((e) => {
        let kk;
        e.payment?.map((f) => {
          kk = {
            date: e.createdAt,
            modality: e.modality,
            investigation: e.investigation,
            paymentType: f.paymentType,
            paymentAmount: f.amount,
          };
        });
        return kk;
      });
    }
  }, [data]);

  console.log(db, "db");

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: "Created At",
      cell: ({ row }) => row.original?.date,
      // @ts-ignore
      filterFn: "dateRangeFilter",
    },
    {
      accessorKey: "modality",
      header: "Modality Name",
      cell: ({ row }) => row.original?.modality,
      // @ts-ignore
    },
    {
      accessorKey: "investigation",
      header: "Investigation",
      cell: ({ row }) => row.original?.investigation,
    },
    {
      accessorKey: "paymentType",
      header: "Payment Type",
      cell: ({ row }) => row.original?.paymentType,
    },
    {
      accessorKey: "paymentAmount",
      header: "Payment Amount",
      cell: ({ row }) => amount(row.original?.paymentAmount),
    },
  ];

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
      setColumnFilters([{ id: "date", value: date }]);
    }
  }, [date, setColumnFilters]);

  const table = useReactTable({
    data: db! || ([] as any),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
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
  const [paymentMethodFilter, setPaymentMethodFilter] = React.useState("");
  const handlePaymentMethodChange = (event: any) => {
    setPaymentMethodFilter(event);
    // Update the table filter
    setColumnFilters([
      ...columnFilters,
      { id: "paymentType", value: event == "all" ? "" : event },
    ]);
  };

  const PaymentMethodDropdown = () => {
    const uniquePaymentMethods = [
      //@ts-ignore
      ...new Set(db?.map((db) => db.paymentType)),
    ];
    return (
      <div className="flex gap-3">
        <Select
          value={paymentMethodFilter}
          onValueChange={handlePaymentMethodChange}
        >
          <SelectTrigger className="w-[180px] border border-blue-200 py-[6px] text-sm items-start rounded-md">
            <SelectValue placeholder="Payment Type" />
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
  console.log(table.getRowModel(), table.getCoreRowModel(), "t");
  return (
    <div className="flex h-full flex-col gap-6 mt-6">
      <div className="w-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className="mb-2">Collection Count</h2>
            <p className="font-bold text-xl  text-gray-700">{data?.length}</p>
          </div>

          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className=" mb-2">Total Collection </h2>
            <p className="text-gray-700 text-xl font-bold">
              {amount(
                table
                  .getCoreRowModel()
                  .flatRows.reduce(
                    (sum: number, booking) =>
                      sum + booking.original.paymentAmount!,
                    0
                  )
              )}
            </p>
          </div>

          <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
            <h2 className="mb-2">Collection in the selected period</h2>
            <p className="font-bold text-xl  text-gray-700">
              {amount(
                table
                  .getRowModel()
                  .flatRows.reduce(
                    (sum: number, booking) =>
                      sum + booking.original.paymentAmount!,
                    0
                  )
              )}
            </p>
          </div>
        </div>
        <div className="bg-blue-100 rounded-md p-4 my-4">
          <h1>Top Payment Methods</h1>
          <BarList
            data={aggregatePayments(table.getRowModel().flatRows)}
            valueFormatter={amount}
            className="mt-4"
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
              setPaymentMethodFilter("");
            }}
          >
            Clear filter
          </Button>

          <PaymentMethodDropdown />

          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => downloadCSV(table.getRowModel().flatRows)}
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
        {/* <div className="flex items-center justify-end space-x-2 py-4">
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
        </div> */}
      </div>
    </div>
  );
}

function aggregatePayments(data: any) {
  const paymentMap = new Map();
  console.log(data, "data");
  data.forEach(({ original: item }: { original: any }) => {
    if (paymentMap.has(item.paymentType)) {
      paymentMap.set(
        item.paymentType,
        paymentMap.get(item.paymentType) + item.paymentAmount
      );
    } else {
      paymentMap.set(item.paymentType, item.paymentAmount);
    }
  });

  return Array.from(paymentMap, ([name, value]) => ({ name, value }));
}
