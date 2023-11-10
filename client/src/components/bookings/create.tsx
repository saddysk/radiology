"use client";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { CreateBookingDto, RateListDto } from "@/app/api/data-contracts";
import { booking } from "@/app/api";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  IAgeInYears,
  aggregateDoctorData,
  convertAgeFromYearsToMonths,
} from "@/lib/utils";
import { MinusSquareIcon, PlusSquareIcon } from "lucide-react";
import InputFile from "./input-file";
import { zodResolver } from "@hookform/resolvers/zod";

const paymentSchema = z.object({
  discount: z.number().optional(),
  extraCharge: z.string().optional(),
  payments: z.array(
    z.object({
      amount: z.number(),
      paymentType: z.string(),
    })
  ),
});

const ageInYearsSchema = z.object({
  years: z.number(),
  months: z.number(),
});

const patientSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
  gender: z.string(),
  phone: z
    .string()
    .refine((value) => /^[1-9]\d{9}$/.test(value), "Phone number is invalid."),

  email: z.string().email().optional(),
  address: z.string(),
  abhaId: z.string().nullable().optional(),
});

const bookingSchema = z.object({
  centreId: z.string(),
  consultant: z.string(),
  modality: z.string(),
  investigation: z.string(),
  remark: z.string().optional(),
  recordFile: z.any().optional(), // Adjust this based on what `recordFile` should be
  patient: patientSchema,
  payment: paymentSchema,
  ageInYears: ageInYearsSchema,
});

type BokingDtoType = CreateBookingDto & {
  /** @format binary */
  recordFile?: File;
} & { ageInYears: IAgeInYears };

export function AddBookingsComponent({
  centreId,
  onSuccess,
}: {
  centreId: string;
  onSuccess: any;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState(0);
  const [commissionAmount, setCommissionAmount] = useState(0);

  const addBookingForm = useForm<BokingDtoType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      centreId: centreId,
      consultant: undefined,
      modality: undefined,
      investigation: undefined,
      remark: "",
      recordFile: undefined,
      patientNumber: "",
      patient: {
        name: "",
        age: undefined,
        gender: undefined,
        phone: "",
        email: "",
        address: "",
        abhaId: "",
      },
      payment: {
        discount: 0,
        extraCharge: "",
        payments: [
          {
            amount: undefined,
            paymentType: "",
          },
        ],
      },
      ageInYears: {
        years: 1,
        months: 0,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: addBookingForm.control,
    name: "payment.payments",
  });

  const { data: dataRateList, isLoading: isLoadingRateList } = useGetRateList({
    centreId,
  });
  const {
    data: dataAllDoctorsForCentre,
    isLoading: isLoadingAllDoctorsForCentre,
  } = useGetAllDoctorsForCentreData({
    centreId,
    enabled: true,
  });

  const doctors = dataAllDoctorsForCentre?.data
    ? aggregateDoctorData(dataAllDoctorsForCentre.data)
    : [];

  const updateCost = () => {
    const modalityId = addBookingForm.getValues("modality");
    const investigationId = addBookingForm.getValues("investigation");
    const extraCharge =
      Number(addBookingForm.getValues("payment.extraCharge")) || 0;
    const discount = Number(addBookingForm.getValues("payment.discount")) || 0;

    const selectedModality = dataRateList?.data.find(
      (mod) => mod.id === modalityId
    );
    const selectedInvestigation = selectedModality?.investigation.find(
      (inv) => inv.id === investigationId
    );

    // Calculating initial cost and discount
    const initialCost = Number(selectedInvestigation?.amount) || 0;
    setCost(initialCost - discount + extraCharge);
    console.log(selectedModality, initialCost, "here");
    calculateReferralAmount(selectedModality!, initialCost);
  };

  const calculateReferralAmount = (
    selectedModality: RateListDto,
    initialCost: number
  ) => {
    // referral amount
    const doctorId = addBookingForm.getValues("consultant");
    const selectedDoctor = doctors?.find((doc) => doc.doctorId === doctorId);
    const discountPercentage = selectedDoctor?.[selectedModality?.modality];
    const discountAmount =
      Math.round((discountPercentage / 100) * initialCost) || 0;

    setCommissionAmount(discountAmount);
  };

  async function addBookingSubmit(bookingData: BokingDtoType) {
    try {
      setLoading(true);

      const { ageInYears, ...data } = bookingData;

      if (data.patient) {
        data.patient.age = convertAgeFromYearsToMonths(ageInYears);
      }

      let partialCosts = 0;
      data.payment.payments.map((e) => {
        partialCosts = (e.amount || 0) + (partialCosts || 0);
      });
      if (cost !== partialCosts) {
        toast({
          title: `Total cost breakdown doesn't match payable cost`,
          variant: "default",
        });
        return;
      }

      const response = await booking.bookingControllerCreate({
        ...data,
        modality: dataRateList?.data.find((e) => e.id == data.modality)
          ?.modality!,
        investigation: dataRateList?.data
          .find((e) => e.id == data.modality)
          ?.investigation.find((e) => e.id == data.investigation)?.type!,
        centreId,
        totalAmount: cost,
        referralAmount: commissionAmount,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        onSuccess();
      }
    } catch (error: any) {
      console.log(error, "here");
      toast({
        title: "Error",
        description:
          error.response.status === 400
            ? error.response.data.message
            : "Error in validation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
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

          <div className="w-full flex items-end gap-10">
            <FormField
              control={addBookingForm.control}
              name="ageInYears.years"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Age</FormLabel>
                  <div className="flex items-center gap-3">
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
                    <p className="text-sm font-medium">
                      {addBookingForm.watch("ageInYears.years") === 1
                        ? "year"
                        : "years"}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={addBookingForm.control}
              name="ageInYears.months"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex items-center gap-3">
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
                    <p className="text-sm font-medium">
                      {addBookingForm.watch("ageInYears.months") === 1
                        ? "month"
                        : "months"}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={addBookingForm.control}
            name="patient.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // This should update the form state
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full border border-blue-200 bg-blue-50 shadow-none">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className=" border-blue-200 bg-blue-50">
                      <SelectItem value={"Male"} className="capitalize">
                        Male
                      </SelectItem>
                      <SelectItem value={"Female"} className="capitalize">
                        Female
                      </SelectItem>
                      <SelectItem value={"Null"} className="capitalize">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Input placeholder="Email Address" type="email" {...field} />
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
                      field.onChange(value);
                      updateCost();
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full border border-blue-200 bg-blue-50 shadow-none">
                      <SelectValue placeholder="Select a consultant" />
                    </SelectTrigger>
                    <SelectContent className=" border-blue-200 bg-blue-50">
                      {doctors?.map((doctor: any, i: number) => (
                        <SelectItem
                          value={doctor?.doctorId}
                          key={i}
                          className="capitalize"
                        >
                          {doctor?.doctorName}
                        </SelectItem>
                      ))}
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
                      updateCost();
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full border border-blue-200 bg-blue-50 shadow-none">
                      <SelectValue placeholder="Select a Modality" />
                    </SelectTrigger>
                    <SelectContent className=" border-blue-200 bg-blue-50">
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // This should update the form state
                      updateCost();
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full border border-blue-200 bg-blue-50 shadow-none">
                      <SelectValue placeholder="Select an Investigation" />
                    </SelectTrigger>
                    <SelectContent className=" border-blue-200 bg-blue-50">
                      {dataRateList?.data
                        .filter(
                          (ratelist) => ratelist.investigation.length !== 0
                        )
                        .find(
                          (e) => e.id == addBookingForm.getValues("modality")
                        )
                        ?.investigation.map((investigation, i) => {
                          return (
                            <SelectItem
                              value={investigation.id!}
                              key={investigation.id}
                            >
                              {investigation.type.toUpperCase()}
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

          <InputFile
            id="prescription"
            name="recordFile"
            onFileUpload={(file: any) => {
              addBookingForm.setValue("recordFile", file);
            }}
          />

          <FormItem>
            <FormLabel>Total amount payable</FormLabel>
            <Input
              value={cost}
              disabled
              className="border-blue-200 cursor-not-allowed"
              placeholder="Total amount payable"
            />
          </FormItem>

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
          {/* Payment */}
          <h2 className="text-xl">Payment Details</h2>

          <FormField
            control={addBookingForm.control}
            name={`payment.extraCharge`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Charge</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Emergency Charge"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Use a regular expression to check if the input value is numeric
                      if (/^\d*\.?\d*$/.test(value)) {
                        const numberValue = Number(value);
                        field.onChange(numberValue);
                        updateCost();
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
            name={`payment.discount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Discount"
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Use a regular expression to check if the input value is numeric
                      if (/^\d*\.?\d*$/.test(value)) {
                        const numberValue = Number(value);
                        field.onChange(numberValue);
                        updateCost();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {fields.map((_, index) => (
            <div
              key={index}
              className="flex flex-row-reverse gap-2 items-start justify-between"
            >
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    append({
                      amount: 0,
                      paymentType: "",
                    });
                  }}
                >
                  <PlusSquareIcon />
                </button>
                {fields.length > 1 && (
                  <button onClick={() => remove(index)}>
                    <MinusSquareIcon />
                  </button>
                )}
              </div>

              <div className="w-full flex flex-col gap-2 border border-blue-200 rounded-md p-4">
                <FormField
                  control={addBookingForm.control}
                  name={`payment.payments.${index}.amount`}
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
                  name={`payment.payments.${index}.paymentType`}
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
            </div>
          ))}
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
  );
}
