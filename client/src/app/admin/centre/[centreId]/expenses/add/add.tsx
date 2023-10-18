"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { CreateDoctorCommissionDto } from "@/app/api/data-contracts";
import { drcommission } from "@/app/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const expensesSchema = z.object({
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  amount: z.number(),
  expenseType: z.string(),
  paymentMethod: z.string(),
  remark: z.string().optional(),
});

export function AddExpenses({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addExpensesForm = useForm({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      date: "",
      amount: "",
      expenseType: "",
      paymentMethod: "",
      remark: "",
    },
  });

  async function addExpenseSubmit(data: CreateDoctorCommissionDto) {
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
    <div className="flex flex-col items-center justify-center py-28 space-y-6 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%] overflow-y-auto">
      <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mb-6">
        <span>Add Expenses</span>
      </h1>
      <Form {...addExpensesForm}>
        <form
          onSubmit={addExpensesForm.handleSubmit(addExpenseSubmit)}
          className="space-y-8 sm:w-1/2 px-4 w-full"
        >
          {true ? (
            <div className="flex flex-col gap-12 justify-center">
              <FormField
                control={addExpensesForm.control}
                name="doctorId"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl></FormControl>
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
  );
}
