"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { CreateDoctorCommissionDto } from "@/app/api/data-contracts";
import { drcommission } from "@/app/api";
import { z } from "zod";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const bookingSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  smk: z.string(),
  age: z.number(), // in years and months
  gender: z.string(),
  phone: z
    .string()
    .refine((value) => /^[1-9]\d{9}$/.test(value), "Phone number is invalid."),
  address: z.string(),
  consultant: z.string(),
  modality: z.string(),
  modalityType: z.string(),
  amount: z.number(),
  discountAmount: z.number(),
  discountRemarks: z.string(),
  emergencyCharges: z.number(),
  paymentType: z.string(),
  paymentStatus: z.string(),
  paymentId: z.string(),
  submittedBy: z.string(),
});

export function AddBookings({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addDoctorToCentreForm = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctorId: "",
      centreId: "",
      commissions: [
        {
          modality: "x-ray",
          amount: 0,
        },
        {
          modality: "ct-scan",
          amount: 0,
        },
        {
          modality: "usg",
          amount: 0,
        },
      ],
    },
  });

  async function addDoctorToCentreSubmit(data: CreateDoctorCommissionDto) {
    console.log("here");

    setLoading(true);
    try {
      const response = await drcommission.doctorCommissionControllerAdd(data);
      console.log(response);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Doctor added to centre`,
          variant: "default",
        });
        router.push("/pr/dashboard");
      }
    } catch (error: any) { 
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      //router.push("/login");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      <div className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%]">
        <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mb-12">
          <span>Connect Doctor to Centre</span>
        </h1>
        <Form {...addDoctorToCentreForm}>
          <form
            onSubmit={addDoctorToCentreForm.handleSubmit(
              addDoctorToCentreSubmit
            )}
            className="space-y-8 sm:w-1/2 px-4 w-full"
          >
            {true ? (
              <div className="flex flex-col gap-12 justify-center">
                <FormField
                  control={addDoctorToCentreForm.control}
                  name="centreId"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          onValueChange={(value) => field.onChange(value)}
                          className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                        >
                          {/* {dataAllCentres?.data?.map((centre, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-6 border border-white rounded-md"
                            >
                              <RadioGroupItem
                                value={centre.id}
                                id={centre.id}
                              />
                              <Label htmlFor={centre.id} className="text-lg">
                                {centre.name}
                              </Label>
                            </div>
                          ))} */}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addDoctorToCentreForm.control}
                  name="doctorId"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          {...field}
                          onValueChange={(value) => field.onChange(value)}
                          className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                        >
                          {/* {dataAllDoctors?.data?.map((doctor, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-6 border border-white rounded-md"
                            >
                              <RadioGroupItem
                                value={doctor.id}
                                id={doctor.id}
                              />
                              <Label htmlFor={doctor.id} className="text-lg">
                                {doctor.name}
                              </Label>
                            </div>
                          ))} */}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <h2>Commissions</h2>
                <div className="flex flex-col gap-4">
                  {addDoctorToCentreForm
                    .watch("commissions")
                    .map((commission, index) => (
                      <FormField
                        control={addDoctorToCentreForm.control}
                        name={`commissions.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-[1fr_3fr] gap-2 justify-normal items-center">
                                <h3 className="uppercase">
                                  {commission.modality}
                                </h3>
                                <Input
                                  placeholder="Amount"
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    const numberValue = Number(e.target.value);
                                    field.onChange(numberValue);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                        key={index}
                      />
                    ))}
                </div>
                <div className="flex flex-col items-center justify-between space-y-6">
                  <Button
                    type="submit"
                    value="submit"
                    loading={loading}
                    variant="outline"
                    className="w-full sm:w-1/2 border-zinc-600"
                  >
                    Connect Doctor to Centre
                  </Button>
                </div>
              </div>
            ) : (
              <CenteredSpinner />
            )}
          </form>
        </Form>
      </div>
    </Card>
  );
}
