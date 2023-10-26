"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { CreateBookingDto } from "@/app/api/data-contracts";
import { booking } from "@/app/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const bookingSchema = z.object({
  //user
  name: z.string(),
  email: z.string().email(),
  age: z.number(), // in years and months
  gender: z.string(),
  phone: z
    .string()
    .refine((value) => /^[1-9]\d{9}$/.test(value), "Phone number is invalid."),
  address: z.string(),
  abhaId: z.string().nullable(),

  //booking
  centreId: z.string(),
  submittedBy: z.string(),
  consultant: z.string(),

  modality: z.string(),
  investigation: z.string(),

  amount: z.number(),
  discount: z.number(),
  remarks: z.string(),
  emergencyCharges: z.number(),

  paymentType: z.string(),
});

export function AddBookings({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addBookingForm = useForm<CreateBookingDto>({
    //resolver: zodResolver(bookingSchema),
    defaultValues: {
      centreId: centreId, // UUID expected, using empty string as default
      consultant: "b04bc0e1-cdc5-47ef-b1b1-944425b787c3", // UUID expected, using empty string as default
      modality: "",
      investigation: "",
      amount: 0,
      discount: 0, // Optional, defaulting to 0
      remark: "", // Optional, using empty string as default
      extraCharge: "", // Optional, using empty string as default
      paymentType: "",
      patient: {
        name: "",
        age: 0,
        gender: "",
        phone: "",
        email: "", // Optional, using empty string as default
        address: "",
        abhaId: "", // Optional, using empty string as default
      },
    },
  });
  console.log(addBookingForm, addBookingForm.getValues());
  async function addBookingSubmit(data: CreateBookingDto) {
    console.log(data);

    setLoading(true);
    try {
      const response = await booking.bookingControllerCreate({
        ...data,
        centreId,
      });
      console.log(response);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Expense added to centre`,
          variant: "default",
        });
        router.push(`/admin/centre/${centreId}`);
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
    <div className="flex flex-col items-center w-full h-[85vh] p-8 overflow-y-scroll">
      <h1 className="text-4xl text-center opacity-90 items-center space-x-4 mb-6">
        <span>Add Bookings</span>
      </h1>
      <Form {...addBookingForm}>
        <form
          onSubmit={addBookingForm.handleSubmit(addBookingSubmit)}
          className="space-y-8 w-[60%] px-4 w-full"
        >
          <div className="flex flex-col gap-8 bg-zinc-900 p-4 py-8 rounded-md justify-center">
            <h2 className="text-xl">Patient Details</h2>

            <FormField
              control={addBookingForm.control}
              name="patient.name"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Patient Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Age"
                      {...field}
                      onChange={(e) => {
                        const numberValue = Number(e.target.value);
                        field.onChange(numberValue);
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input placeholder="Gender" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="patient.abhaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abha ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Abha ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-8 bg-zinc-900 p-4 py-8 rounded-md justify-center">
            {/* Booking Details */}
            <h2 className="text-xl">Booking Details</h2>

            <FormField
              control={addBookingForm.control}
              name="modality"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modality</FormLabel>
                  <FormControl>
                    <Input placeholder="Modality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="investigation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investigation</FormLabel>
                  <FormControl>
                    <Input placeholder="Investigation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      onChange={(e) => {
                        const numberValue = Number(e.target.value);
                        field.onChange(numberValue);
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Discount"
                      {...field}
                      onChange={(e) => {
                        const numberValue = Number(e.target.value);
                        field.onChange(numberValue);
                      }}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-zinc-600"
                      placeholder="Remarks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="extraCharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Charge</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Extra Charge"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Payment Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col items-center justify-between space-y-6">
            <Button
              type="submit"
              value="submit"
              loading={loading}
              variant="outline"
              className="w-full sm:w-1/2 border-zinc-600"
            >
              Add Booking
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
