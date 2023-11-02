"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreateBookingDto,
  DoctorCommissionDto,
} from "@/app/api/data-contracts";
import { booking } from "@/app/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllDoctorsForCentreData,
  useGetRateList,
} from "@/lib/query-hooks";
import { aggregateDoctorData } from "@/lib/utils";

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
  const [selectedModality, setSelectedModality] = useState("");

  const addBookingForm = useForm<CreateBookingDto>({
    //resolver: zodResolver(bookingSchema),
    defaultValues: {
      centreId: centreId, // UUID expected, using empty string as default
      consultant: "", // UUID expected, using empty string as default
      modality: "",
      investigation: "",
      remark: "",
      patient: {
        name: "",
        age: 0,
        gender: "",
        phone: "",
        email: "",
        address: "",
        abhaId: "",
      },
      payment: [
        {
          amount: 0,
          discount: 0,
          extraCharge: "",
          paymentType: "",
        },
      ],
    },
  });

  const { data: dataRateList, isLoading: IsLoadingRateList } = useGetRateList({
    centreId,
  });
  const {
    data: dataAllDoctorsForCentre,
    isLoading: isLoadingAllDoctorsForCentre,
  } = useGetAllDoctorsForCentreData({
    centreId,
    enabled: true,
  });

  const doctors = aggregateDoctorData(dataAllDoctorsForCentre?.data);

  async function addBookingSubmit(data: CreateBookingDto) {
    setLoading(true);
    try {
      const response = await booking.bookingControllerCreate({
        ...data,
        modality: dataRateList?.data.find((e) => e.id == data.modality)
          ?.modality!,
        centreId,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Booking successful`,
          variant: "default",
        });
        router.push(`/admin/centre/${centreId}/bookings`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response.data.statuCode === 400
            ? error.response.data.message
            : "Something went wrong",
        variant: "destructive",
      });

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
          className="space-y-8 px-4 sm:w-[60%] w-full"
        >
          <div className="flex flex-col gap-8 bg-blue-100 p-8 py-8 rounded-md justify-center">
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
                        const value = e.target.value;
                        // Use a regular expression to check if the input value is numeric
                        if (/^\d*\.?\d*$/.test(value)) {
                          const numberValue = Number(value);
                          field.onChange(numberValue);
                        }
                      }}
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
                    <Input
                      placeholder="Email Address"
                      type="email"
                      {...field}
                    />
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
                    <Input placeholder="Address" type="address" {...field} />
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
          <div className="flex flex-col gap-8 bg-blue-100 p-4 py-8 rounded-md justify-center">
            {/* Booking Details */}
            <h2 className="text-xl">Booking Details</h2>

            <FormField
              control={addBookingForm.control}
              name="consultant"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultant</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value); // This should update the form state
                        setSelectedModality("");
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border border-blue-200 shadow-none">
                        <SelectValue placeholder="Select a consultant" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-100 border-blue-200">
                        {doctors.map((doctor: any, i: number) => {
                          return (
                            <SelectItem value={doctor?.doctor?.id} key={i}>
                              {doctor?.doctor?.name.toUpperCase()}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name="modality"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modality</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value); // This should update the form state
                        setSelectedModality(value);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border border-blue-200 shadow-none">
                        <SelectValue placeholder="Select a Modality" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-100 border-blue-200">
                        {dataRateList?.data
                          .filter(
                            (ratelist) => ratelist.investigation.length !== 0
                          )
                          .map((rateList, i) => {
                            return (
                              <SelectItem value={rateList.id} key={rateList.id}>
                                {rateList.modality.toUpperCase()}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
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
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-blue-200"
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
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-blue-200"
                      placeholder="Remarks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-8 bg-blue-100 p-4 py-8 rounded-md justify-center">
            {/* Booking Details */}
            <h2 className="text-xl">Payment Details</h2>

            <FormField
              control={addBookingForm.control}
              name={`payment.${0}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Use a regular expression to check if the input value is numeric
                        if (/^\d*\.?\d*$/.test(value)) {
                          const numberValue = Number(value);
                          field.onChange(numberValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name={`payment.${0}.discount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Discount"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Use a regular expression to check if the input value is numeric
                        if (/^\d*\.?\d*$/.test(value)) {
                          const numberValue = Number(value);
                          field.onChange(numberValue);
                        }
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
              name={`payment.${0}.extraCharge`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extra Charge</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Extra Charge"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Use a regular expression to check if the input value is numeric
                        if (/^\d*\.?\d*$/.test(value)) {
                          const numberValue = Number(value);
                          field.onChange(numberValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addBookingForm.control}
              name={`payment.${0}.paymentType`}
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
              className="w-full sm:w-1/2 border-blue-200"
            >
              Add Booking
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
