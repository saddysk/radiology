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
import { BarList, DonutChart } from "@tremor/react";

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
  let filterDataByDate = output;

  const startDate = dateRange?.from;
  const endDate = dateRange?.to;
  if (startDate != null && endDate != null) {
    filterDataByDate = output.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  const groupedByDoctor: any = {};

  for (const item of filterDataByDate) {
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

  const filteredData = React.useMemo(() => {
    if (data) {
      return formatOutputToDto(data, date);
    }
  }, [data, date]);

  console.log(filteredData);
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

  const modalities = getModalityNames(filteredData!);

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "name",
      header: "Name",
      // @ts-ignore
      cell: ({ row }) => row.original?.name,
    },
    {
      accessorKey: "modality",
      header: "Total Referrals",
      cell: ({ row }) => {
        // @ts-ignore
        const totalReferrals = row.original?.modality?.reduce(
          (acc: any, mod: any) => acc + mod.referralCount,
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
        // @ts-ignore
        const totalAmount = row.original?.modality?.reduce(
          (acc: any, mod: any) => acc + mod.referralAmount,
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
    data: filteredData! || ([] as any),
    columns: columns as any,
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

  const cities = [
    {
      name: "New York",
      sales: 9800,
    },
    {
      name: "London",
      sales: 4567,
    },
    {
      name: "Hong Kong",
      sales: 3908,
    },
    {
      name: "San Francisco",
      sales: 2400,
    },
    {
      name: "Singapore",
      sales: 1908,
    },
    {
      name: "Zurich",
      sales: 1398,
    },
  ];

  function convertData(data: any) {
    const totalCounts: { [key: string]: number } = {};

    data.forEach((item: any) => {
      item.original.modality.forEach((modality: any) => {
        if (!totalCounts[modality.name]) {
          totalCounts[modality.name] = 0;
        }
        totalCounts[modality.name] += modality.referralCount;
      });
    });

    return Object.keys(totalCounts).map((name) => ({
      name: name,
      value: totalCounts[name],
    }));
  }

  return (
    <div className="flex h-full flex-col gap-6 mt-6">
      <div className="w-full">
        <div className="bg-blue-100 rounded-md p-4 mb-2">
          <h1>Modality Wise Count</h1>
          <BarList
            data={convertData(table.getRowModel().flatRows)}
            className="mt-4"
          />
        </div>
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
            onClick={() => downloadCSV(table.getRowModel().flatRows)}
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
      </div>
    </div>
  );
}
