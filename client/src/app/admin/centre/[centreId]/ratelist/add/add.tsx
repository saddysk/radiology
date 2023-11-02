"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { ratelist } from "@/app/api";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetRateList } from "@/lib/query-hooks";
import { ratelistData } from "../data";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const rateListsSchema = z.object({
  rateLists: z.array(
    z.object({
      modality: z.string(),
      investigation: z.array(
        z.object({
          type: z.string(),
          amount: z.number(),
          filmCount: z.number(),
          isSelected: z.boolean(),
        })
      ),
    })
  ),
});

type RateList = {
  modality: string;
  investigation: Array<Investigations>;
};

type Investigations = {
  type: string;
  amount: number;
  filmCount: number;
  isSelected?: boolean;
};

export function AddRateList({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [investigationUpdates, setInvestigationUpdates] = useState({
    id: "",
    type: "",
    amount: 0,
    filmCount: 0,
  });
  const {
    data: dataRateList,
    isLoading: isLoadingRateList,
    isError,
  } = useGetRateList({
    centreId,
  });

  const { toast } = useToast();
  const router = useRouter();

  interface FormDTO {
    centreId: string;
    rateLists: {
      modality: string;
      investigation: {
        type: string;
        amount: number;
        filmCount: number;
        isSelected: boolean;
      }[];
    }[];
  }

  const form = useForm<FormDTO>({
    resolver: zodResolver(rateListsSchema),
    defaultValues: {
      rateLists: ratelistData.map((ratelist: RateList) => {
        return {
          modality: ratelist.modality,
          investigation: ratelist.investigation.map((inv: Investigations) => ({
            ...inv,
            amount: inv.amount,
            filmCount: inv.filmCount ? inv.filmCount : 0, // convert string to number
            isSelected: false,
          })),
        };
      }),
    },
  });

  type TselectedRows = {
    [key: string]: boolean;
  };
  const [selectedRows, setSelectedRows] = useState<TselectedRows>({});

  const updateRateList = async ({ e }: { e: any }) => {
    e.preventDefault();
    try {
      if (!dataRateList?.data) {
        throw new Error("No data found");
      }

      setLoading(true);

      const rateListToUpdate = dataRateList?.data?.find(
        (rateList) => rateList.id === investigationUpdates.id
      );

      const updatedInvestigations = rateListToUpdate
        ? [...rateListToUpdate.investigation, investigationUpdates]
        : [investigationUpdates];

      const response = await ratelist.rateListControllerUpdate({
        id: investigationUpdates.id,
        investigation: updatedInvestigations,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["ratelist", centreId]);
        toast({
          title: "Ratelist Updated",
          variant: "default",
        });
        setInvestigationUpdates({
          id: "",
          type: "",
          amount: 0,
          filmCount: 0,
        });
        setLoading(false);
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

  async function onSubmit(data: FormDTO) {
    // Prepare the data to be sent to the API
    const filteredData = data.rateLists.map((rateList: RateList) => {
      return {
        ...rateList,
        investigation: rateList.investigation
          .filter(
            (investigation, index) =>
              selectedRows[`${rateList.modality}-${index}`]
          )
          .map((i) => {
            return { type: i.type, amount: i.amount, filmCount: i.filmCount };
          }),
      };
    });
    setLoading(true);
    try {
      const response = await ratelist.rateListControllerCreate({
        centreId: centreId,
        rateLists: filteredData,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Rate List Added`,
          variant: "default",
        });
        queryClient.cancelQueries(["ratelist", centreId]);
        router.push(`/admin/centre/${centreId}/ratelist`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingRateList) {
    return (
      <div className="w-full h-full flex justify-center align-center">
        <CenteredSpinner />
      </div>
    );
  }
  if (isError) {
    return <div className="m-10">No ratelist added</div>;
  }

  return (
    <div className="flex flex-col items-center w-full h-[85vh] p-8 overflow-y-scroll">
      <h1 className="text-3xl text-center opacity-90 items-center space-x-4 mb-6">
        <span>Add Ratelist</span>
      </h1>
      {dataRateList?.data?.length === 0 ? (
        <Form {...form}>
          <form
            className="flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {ratelistData.map((rateList, i) => (
              <div key={i} className="p-6 my-4 rounded-lg   bg-blue-100">
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
                    {rateList?.investigation?.map((investigation, j) => (
                      <TableRow key={j}>
                        <TableCell>
                          <Controller
                            control={form.control}
                            name={`rateLists.${i}.investigation.${j}.isSelected`}
                            render={({ field }) => (
                              <Input
                                type="checkbox"
                                checked={field.value}
                                className="w-auto h-4 mr-auto text-green-600 bg-gray-100 border-gray-300 rounded"
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
                            control={form.control}
                            name={`rateLists.${i}.investigation.${j}.amount`}
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
                            control={form.control}
                            name={`rateLists.${i}.investigation.${j}.filmCount`}
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
            <Button
              type="submit"
              loading={loading}
              variant={"default"}
              className="w-full border sm:w-1/2 border-blue-200 m-auto mt-10"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-8  px-4 w-full mt-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Ratelist</label>
              <Select
                value={investigationUpdates.id}
                onValueChange={(val) =>
                  setInvestigationUpdates({ ...investigationUpdates, id: val })
                }
              >
                <SelectTrigger className="w-full border border-blue-200 shadow-none">
                  <SelectValue placeholder="Select a Modality" />
                </SelectTrigger>
                <SelectContent className="bg-blue-50 border-blue-200">
                  {dataRateList.data.map((rateList, i) => {
                    return (
                      <SelectItem value={rateList.id} key={i}>
                        {rateList.modality.toUpperCase()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Type</label>
              <Input
                id="name"
                value={investigationUpdates.type}
                className="col-span-3"
                onChange={(e) => {
                  setInvestigationUpdates({
                    ...investigationUpdates,
                    type: e.target.value,
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Amount</label>
              <Input
                id="amount"
                type="number"
                value={investigationUpdates.amount}
                onChange={(e) => {
                  setInvestigationUpdates({
                    ...investigationUpdates,
                    amount: Number(e.target.value),
                  });
                }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name">Film Count</label>
              <Input
                id="count"
                type="number"
                value={investigationUpdates.filmCount}
                onChange={(e) => {
                  setInvestigationUpdates({
                    ...investigationUpdates,
                    filmCount: Number(e.target.value),
                  });
                }}
                className="col-span-3"
              />
            </div>
          </div>

          <Button
            type="button"
            loading={loading}
            onClick={(e) => {
              updateRateList({
                e,
              });
            }}
            className="border border-blue-200"
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
}
