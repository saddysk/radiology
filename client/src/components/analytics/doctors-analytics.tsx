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

type Modality = {
  name: string;
  referralCount: number;
  amount: number;
  referralAmount: number;
};

type Doctor = {
  name: string;
  id: string;
  modality: Modality[];
};

type Data = Doctor[];

function formatOutputToDto(output: BookingDto[], dateRange: DateRange) {
  if (!output) {
    return;
  }

  // let filterDataByDate = output;

  // const startDate = dateRange?.from;
  // const endDate = dateRange?.to;
  // if (startDate != null && endDate != null) {
  //   filterDataByDate = output.filter((item) => {
  //     const itemDate = new Date(item.createdAt);
  //     return itemDate >= startDate && itemDate <= endDate;
  //   });
  // }

  const groupedByDoctor: any = {};

  for (const item of output) {
    const doctorId = item.consultant;

    if (!groupedByDoctor[doctorId]) {
      groupedByDoctor[doctorId] = {
        name: item.consultantName,
        id: doctorId,
        modality: [],
      };
    }

    const referralAmount = item.referralAmount ? item.referralAmount : 0;
    const totalAmount = item.totalAmount ? item.totalAmount : 0;

    let modalityEntry = groupedByDoctor[doctorId].modality.find(
      (m: any) => m.name === item.modality
    );

    if (!modalityEntry) {
      modalityEntry = {
        name: item.modality,
        referralCount: 0,
        amount: 0,
        referralAmount: 0,
      };
      groupedByDoctor[doctorId].modality.push(modalityEntry);
    }

    modalityEntry.referralCount += 1;
    modalityEntry.amount += totalAmount;
    modalityEntry.referralAmount += referralAmount;
  }

  const result = Object.values(groupedByDoctor).map((doctor: any) => {
    return {
      name: doctor.name,
      id: doctor.id,
      modality: doctor.modality,
    };
  });

  return result;
}

export function DoctorsAnalyticsComponent({
  data,
}: {
  data: BookingDto[] | undefined;
  startDate: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [date, setDate] = React.useState<DateRange>({
    from: null,
    to: null,
  });

  const dataa = React.useMemo(() => {
    if (data) {
      formatOutputToDto(data, date);
    }
  }, [data, date]);

  function getModalityNames(data: Data) {
    const modalityNames: string[] = [];
    if (!data) {
      return [];
    }
    for (const doctor of data) {
      for (const modality of doctor.modality) {
        if (!modalityNames.includes(modality.name)) {
          modalityNames.push(modality.name);
        }
      }
    }
    return modalityNames;
  }

  const modalities = getModalityNames(dataa!);

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original?.name,
      // @ts-ignore
    },
    {
      accessorKey: "modality",
      header: "Total Referrals",
      cell: ({ row }) => {
        const totalReferrals = row.original?.modality?.reduce(
          (acc, mod) => acc + mod.referralCount,
          0
        );
        return totalReferrals;
      },
    },
    ...modalities?.map((m) => {
      return {
        accessorKey: "modality.name",
        header: `${toTitleCase(m)} Count`,
        cell: ({ row }: { row: any }) =>
          row?.original.modality.find((mod: any) => mod.name === m)
            ? row?.original.modality.find((mod: any) => mod.name === m)
                .referralCount
            : "0",
      };
    }),
    ...modalities?.map((m) => {
      return {
        accessorKey: "modality.name",
        header: `${toTitleCase(m)} Amount`,
        cell: ({ row }: { row: any }) =>
          row?.original.modality.find((mod: any) => mod.name === m)
            ? amount(
                row?.original.modality.find((mod: any) => mod.name === m).amount
              )
            : amount(0),
      };
    }),
    ...modalities?.map((m) => {
      return {
        accessorKey: "modality.name",
        header: `${toTitleCase(m)} Referral`,
        cell: ({ row }: { row: any }) =>
          row.original.modality.find((mod: any) => mod.name === m)
            ? amount(
                row.original.modality.find((mod: any) => mod.name === m)
                  .referralAmount
              )
            : amount(0),
      };
    }),
    {
      accessorKey: "modality",
      header: "Total Amount",
      cell: ({ row }) => {
        const totalAmount = row.original.modality.reduce(
          (acc, mod) => acc + mod.referralAmount,
          0
        );
        return amount(totalAmount);
      },
    },
  ];

  React.useEffect(() => {
    if (date) {
      setColumnFilters([{ id: "createdAt", value: date }]);
    }
  }, [date, setColumnFilters]);

  const table = useReactTable({
    data: dataa! || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex h-full flex-col gap-6 mt-6">
      <div className="w-full">
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Filter analytics by modality"
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

          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => downloadCSV(table.getCoreRowModel().flatRows)}
          >
            Download CSV
          </Button>
          {/* <DropdownMenu>
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
                      key={column.columnDef.header}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu> */}
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
