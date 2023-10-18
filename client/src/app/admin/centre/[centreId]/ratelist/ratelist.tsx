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
import { Button } from "@/components/ui/button";
import { ratelist } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useGetRateList } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";

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

export function RateList({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const { data: dataRateList, isLoading: IsLoadingRateList } = useGetRateList({
    centreId,
  });
  console.log(dataRateList, "here");
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
  console.log(form.formState.errors, form.getValues());
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
              selectedRows[`${rateList.modality}-${index}`]
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
                    {rateList.investigation.map((investigation, j) => (
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
              variant="outline"
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
              <h3 className="text-xl font-bold mb-4 uppercase">{rateList.modality}</h3>
              <Table>
                {rateList.investigation.length == 0 && (
                  <TableCaption className="py-6">No modality added</TableCaption>
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
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Delete
                        </Button>
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
