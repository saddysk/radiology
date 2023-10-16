"use client";
import { z } from "zod";
import {
  Control,
  Controller,
  Form,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratelists } from "./data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rateListsSchema = z.array(
  z.object({
    modality: z.string(),
    investigations: z.array(
      z.object({
        type: z.string(),
        rate: z.number().nullable(),
        filmCount: z.number().nullable(),
        isSelected: z.boolean(),
      })
    ),
  })
);

type RateList = {
  modality: string;
  investigation: Array<Investigations>;
};

type Investigations = {
  type: string;
  rate: number;
  filmCount: number | null;
  isSelected?: boolean;
};

export function RateList() {
  const form = useForm({
    defaultValues: {
      ratelists: ratelists.map((ratelist: RateList) => {
        return {
          modality: ratelist.modality,
          investigations: ratelist.investigation.map((inv: Investigations) => ({
            ...inv,
            rate: inv.rate,
            filmCount: inv.filmCount ? inv.filmCount : null, // convert string to number
            isSelected: false,
          })),
        };
      }),
      resolver: zodResolver(rateListsSchema),
    },
  });
  const { control, handleSubmit, watch } = form;

  const [selectedRows, setSelectedRows] = useState({});

  // Submit function
  const onSubmit = (data) => {
    // Prepare the data to be sent to the API
    const filteredData = data.ratelists.map((rateList) => {
      return {
        ...rateList,
        investigations: rateList.investigations.filter(
          (investigation, index) =>
            selectedRows[`${rateList.modality}-${index}`]
        ),
      };
    });

    // TODO: Send the filteredData to the API
    console.log("Data to be sent:", filteredData);
  };

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {ratelists.map((rateList, i) => (
            <div
              key={i}
              className={`p-6 my-4 rounded-lg shadow-lg bg-zinc-800`}
            >
              <h3 className="text-xl font-bold mb-4">{rateList.modality}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>

                    <TableHead>Type</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Film Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateList.investigation.map((investigation, j) => (
                    <TableRow key={j}>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`ratelists.${i}.investigations.${j}.isSelected`}
                          render={({ field }) => (
                            <Input
                              type="checkbox"
                              checked={field.value}
                              class="w-auto h-4 mr-auto text-green-600 bg-gray-100 border-gray-300 rounded"
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedRows({
                                  ...selectedRows,
                                  [`${rateList.modality}-${j}`]:
                                    e.target.checked,
                                });
                              }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>{investigation.type}</TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`ratelists.${i}.investigations.${j}.rate`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              value={field.value}
                              disabled={
                                !selectedRows[`${rateList.modality}-${j}`]
                              }
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          control={control}
                          name={`ratelists.${i}.investigations.${j}.filmCount`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              value={field.value}
                              disabled={
                                !selectedRows[`${rateList.modality}-${j}`]
                              }
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          <button
            type="submit"
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </Form>
    </div>
  );
}
