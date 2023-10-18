"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import {
  CreateBookingDto,
  CreateDoctorCommissionDto,
  CreateExpenseDto,
} from "@/app/api/data-contracts";
import { centre, centreexpense, drcommission } from "@/app/api";
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
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const expensesSchema = z.object({
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  amount: z.number(),
  expenseType: z.string(),
  paymentMethod: z.string(),
  remark: z.string().optional(),
});

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
  patientId: z.string(),
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

  const addExpensesForm = useForm<CreateBookingDto>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      centreId: "", // UUID expected, using empty string as default
      consultant: "", // UUID expected, using empty string as default
      modality: "",
      investigation: "",
      amount: 0,
      discount: 0, // Optional, defaulting to 0
      remark: "", // Optional, using empty string as default
      extraCharge: "", // Optional, using empty string as default
      paymentType: "",
      patientId: "", // UUID expected, using empty string as default
      patient: {
        name: "",
        age: 0,
        gender: "",
        phone: "",
        email: "", // Optional, using empty string as default
        address: {
          // Assuming AddressDto has fields like street, city, etc.
          street: "", // Placeholder, adjust as per AddressDto structure
          city: "", // Placeholder, adjust as per AddressDto structure
          // ... other AddressDto fields
        },
        abhaId: "", // Optional, using empty string as default
      },
    },
  });

  async function addExpenseSubmit(data: CreateBookingDto) {
    console.log(data);

    setLoading(true);
    try {
      const response = await centreexpense.expenseControllerCreate({
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
    <div className="flex flex-col items-center justify-center py-28 space-y-6 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%] overflow-y-auto">
      <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mb-6">
        <span>Add Expense</span>
      </h1>
      <Form {...addExpensesForm}>
        <form
          onSubmit={addExpensesForm.handleSubmit(addExpenseSubmit)}
          className="space-y-8 sm:w-1/2 px-4 w-full"
        >
          <div className="flex flex-col gap-12 justify-center">
            <FormField
              control={addExpensesForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of expense created</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal border-zinc-600",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(Date.parse(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-black border-zinc-600"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={Date.parse(field.value)}
                        onSelect={(e) =>
                          addExpensesForm.setValue(
                            "date",
                            e?.toDateString() || "",
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            }
                          )
                        }
                        // disabled={(date) =>
                        //   date > new Date() || date < new Date("1900-01-01")
                        // }
                        className="border-zinc-600"
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addExpensesForm.control}
              name="amount"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const numberValue = Number(e.target.value);
                        field.onChange(numberValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addExpensesForm.control}
              name="expenseType"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Expense Type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addExpensesForm.control}
              name="paymentMethod"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Payment Method" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={addExpensesForm.control}
              name="remark"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="border-zinc-600"
                      placeholder="Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-between space-y-6">
              <Button
                type="submit"
                value="submit"
                loading={loading}
                variant="outline"
                className="w-full sm:w-1/2 border-zinc-600"
              >
                Add Expense to Centre
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
