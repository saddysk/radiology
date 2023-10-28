"use client";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratelistData } from "./data";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { Button } from "@/components/ui/button";
import { ratelist } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useGetRateList } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useQueryClient } from "@tanstack/react-query";

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
        }),
      ),
    }),
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

export function RateList({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { data: dataRateList, isLoading: IsLoadingRateList } = useGetRateList({
    centreId,
  });
  console.log(dataRateList, "here");
  const queryClient = useQueryClient();
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

  async function onSubmit(data: FormDTO) {
    // Prepare the data to be sent to the API
    console.log(1);
    const filteredData = data.rateLists.map((rateList: RateList) => {
      return {
        ...rateList,
        investigation: rateList.investigation
          .filter(
            (investigation, index) =>
              selectedRows[`${rateList.modality}-${index}`],
          )
          .map((i) => {
            return { type: i.type, amount: i.amount, filmCount: i.filmCount };
          }),
      };
    });
    console.log(2);
    setLoading(true);
    console.log(3);
    try {
      const response = await ratelist.rateListControllerCreate({
        centreId: centreId,
        rateLists: filteredData,
      });
      console.log(4, response);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        console.log(5);
        toast({
          title: `Rate List Added`,
          variant: "default",
        });
        //router.push("/admin/onboarding");
      }
    } catch (error: any) {
      console.log(6);
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
    console.log("Data to be sent:", filteredData);
  }
  const [investigationUpdates, setInvestigationUpdates] = useState({
    id: "",
    type: "",
    amount: 0,
    filmCount: 0,
  });
  const updateRateList = async ({
    ratelistId,
    e,
  }: {
    ratelistId: string;
    e: any;
  }) => {
    e.preventDefault();
    try {
      if (!dataRateList?.data) {
        throw new Error("No data found");
      }

      setLoading(true);
      const updatedInvestigations =
        dataRateList.data
          .find((rateList) => rateList.id === investigationUpdates.id)
          ?.investigation?.map((investigation) => {
            if (investigation.type === investigationUpdates.type) {
              return {
                ...investigation,
                amount: investigationUpdates.amount,
                filmCount: investigationUpdates.filmCount,
              };
            } else {
              return investigation;
            }
          }) || []; // Fallback to empty array if undefined

      const response = await ratelist.rateListControllerUpdate({
        id: ratelistId,
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
      {IsLoadingRateList || dataRateList == undefined ? (
        <div className="w-full h-full flex justify-center align-center">
          <CenteredSpinner />
        </div>
      ) : dataRateList?.data?.length === 0 ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {ratelistData.map((rateList, i) => (
              <div
                key={i}
                className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900"
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
              className="w-full sm:w-1/2 border-zinc-600"
            >
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <div className="">
          {dataRateList.data.map((rateList, i) => (
            <div key={i} className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900">
              <h3 className="text-xl font-bold mb-4 uppercase">
                {rateList.modality}
              </h3>
              <Table>
                {rateList.investigation.length == 0 && (
                  <TableCaption className="py-6">
                    No modality added
                  </TableCaption>
                )}
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Rate (in Rs.)</TableHead>
                    <TableHead>Film Count</TableHead>
                    <TableHead className="text-right">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateList.investigation.map((investigation, j) => (
                    <TableRow key={j}>
                      <TableCell>{investigation.type}</TableCell>
                      <TableCell>{investigation.amount}</TableCell>
                      <TableCell>{investigation.filmCount}</TableCell>
                      <TableCell className="space-x-4 text-right">
                        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setInvestigationUpdates({
                                  id: rateList.id,
                                  type: investigation.type,
                                  amount: investigation.amount,
                                  filmCount: investigation.filmCount,
                                });
                              }}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-900 p-8">
                            <DialogHeader>
                              <DialogTitle>Edit investigation</DialogTitle>
                              <DialogDescription>
                                Make changes to your investigation here. Click
                                save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="name">Type</label>
                                <Input
                                  id="name"
                                  value={investigationUpdates.type}
                                  className="col-span-3"
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
                            <DialogFooter>
                              <DialogClose>
                                <Button
                                  type="button"
                                  loading={loading}
                                  onClick={(e) => {
                                    updateRateList({
                                      ratelistId: rateList.id,
                                      e,
                                    });
                                  }}
                                  className="border border-zinc-200"
                                >
                                  Save changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setInvestigationUpdates({
                                  id: rateList.id,
                                  type: investigation.type,
                                  amount: investigation.amount,
                                  filmCount: investigation.filmCount,
                                });
                              }}
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-zinc-900 p-8">
                            <DialogHeader>
                              <DialogTitle>Delete investigation</DialogTitle>
                              <DialogDescription>
                                Make changes to your investigation here. Click
                                save when you're done.
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                              <Button
                                loading={loading}
                                onClick={(e) => {
                                  updateRateList({
                                    ratelistId: rateList.id,
                                    e,
                                  });
                                }}
                                className="border border-zinc-200"
                              >
                                Save change
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
