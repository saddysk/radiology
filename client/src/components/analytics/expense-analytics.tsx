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
import { ExpenseDto } from "@/app/api/data-contracts";
import { amount, downloadCSV } from "@/lib/utils";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { AreaChart, BarList } from "@tremor/react";

const columns: ColumnDef<ExpenseDto>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    //@ts-ignore
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
    from: undefined,
    to: undefined,
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
      setColumnFilters([{ id: "date", value: date }]);
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
          <h2 className="mb-2">Expenses Count</h2>
          <p className="font-bold text-xl  text-gray-700">{data?.length}</p>
        </div>

        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className=" mb-2">Total Expenses </h2>
          <p className="text-gray-700 text-xl font-bold">
            {amount(
              table
                .getCoreRowModel()
                .flatRows.reduce(
                  (sum: number, booking) => sum + booking.original.amount!,
                  0
                )
            )}
          </p>
        </div>

        <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <h2 className="mb-2">Expenses in the selected period</h2>
          <p className="font-bold text-xl  text-gray-700">
            {amount(
              table
                .getRowModel()
                .flatRows.reduce(
                  (sum: number, booking) => sum + booking.original.amount!,
                  0
                )
            )}
          </p>
        </div>
      </div>

      <div className="bg-blue-100 rounded-md p-4 mb-4">
        <h1>Top Payment Methods</h1>
        <BarList
          data={aggregatePayments(table.getRowModel().flatRows)}
          valueFormatter={amount}
          className="mt-4"
        />
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
            placeholder={"Filter expenses by date"}
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
      </div>
    </div>
  );
}

function aggregatePayments(data: any) {
  const paymentMap = new Map();
  console.log(data, "data");
  //@ts-ignore
  data.forEach(({ original: item }) => {
    if (paymentMap.has(item.paymentMethod)) {
      paymentMap.set(
        item.paymentMethod,
        paymentMap.get(item.paymentMethod) + item.amount
      );
    } else {
      paymentMap.set(item.paymentMethod, item.amount);
    }
  });

  return Array.from(paymentMap, ([name, value]) => ({ name, value }));
}
