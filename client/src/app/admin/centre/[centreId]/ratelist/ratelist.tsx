"use client";
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

import { useGetRateList } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const [investigationUpdates, setInvestigationUpdates] = useState({
    id: "",
    type: "",
    amount: 0,
    filmCount: 0,
  });
  const deleteRateList = async ({
    ratelistId,
    investigation: id,
    e,
  }: {
    ratelistId: string;
    investigation: string;
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
          ?.investigation?.filter((investigation) => {
            // Keep the investigation only if its type is NOT equal to the given id
            return investigation.type !== id;
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
  const updateRateList = async ({ e }: { e: any }) => {
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
      <div className="w-full flex">
        <Link href={`/admin/centre/${centreId}/ratelist/add`}>
          <Button className="bg-white text-black hover:opacity-80 ml-auto">
            Add New Ratelist
          </Button>
        </Link>{" "}
      </div>
      {IsLoadingRateList || dataRateList == undefined ? (
        <div className="w-full h-full flex justify-center align-center">
          <CenteredSpinner />
        </div>
      ) : dataRateList?.data?.length === 0 ? (
        <h3>
          No modality added. <br />
          Add modalities to get started!{" "}
          <Link
            className="underline"
            href={`/admin/centre/${centreId}/ratelist/add`}
          >
            Here{" "}
          </Link>
        </h3>
      ) : (
        <div className="">
          {dataRateList.data
            .sort((a, b) => a.modality.localeCompare(b.modality))
            .map((rateList, i) => (
              <div
                key={i}
                className="p-6 my-4 rounded-lg shadow-lg bg-zinc-900"
              >
                <h3 className="text-xl font-bold mb-4 uppercase">
                  {rateList.modality}
                </h3>
                <Table>
                  {rateList.investigation.length == 0 && (
                    <TableCaption className="py-6">
                      No modality added. <br />
                      Add modalities to get started!{" "}
                      <Link
                        className="underline"
                        href={`/admin/centre/${centreId}/ratelist/add`}
                      >
                        Here{" "}
                      </Link>
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
                    {rateList.investigation
                      .sort((a, b) => a.type.localeCompare(b.type))
                      .map((investigation, j) => (
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
                                    console.log({
                                      id: rateList.id,
                                      type: investigation.type,
                                      amount: investigation.amount,
                                      filmCount: investigation.filmCount,
                                    });
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
                                    Make changes to your investigation here.
                                    Click save when you're done.
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
                                  <DialogTitle>
                                    Delete investigation
                                  </DialogTitle>
                                  <DialogDescription>
                                    Investigation once deleted will be gone
                                    foreever.
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    loading={loading}
                                    onClick={(e) => {
                                      deleteRateList({
                                        ratelistId: rateList.id,
                                        investigation: investigation.type,
                                        e,
                                      });
                                    }}
                                    className="border border-red-950 mt-12 bg-red-800"
                                  >
                                    Confirm Delete
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
