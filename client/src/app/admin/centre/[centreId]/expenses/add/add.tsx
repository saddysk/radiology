"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateExpenseDto } from "@/app/api/data-contracts";
import { centreexpense } from "@/app/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addExpensesForm = useForm<CreateExpenseDto>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      date: `${new Date("1900-01-01")}`,
      amount: undefined,
      expenseType: "",
      paymentMethod: "",
    },
  });

  async function addExpenseSubmit(data: CreateExpenseDto) {
    setLoading(true);
    try {
      const response = await centreexpense.expenseControllerCreate({
        ...data,
        centreId,
      });
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["expenses", centreId]);
        toast({
          title: `Expense added to centre`,
          variant: "default",
        });
        router.push(`/admin/centre/${centreId}/expenses`);
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error adding expense",
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
    <div className="flex flex-col items-center justify-center py-28 space-y-6 h-full rounded-md bg-blue-50 border-blue-200 w-[100%] overflow-y-auto">
      <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mb-6">
        <span>Add Expense</span>
      </h1>
      <Form {...addExpensesForm}>
        <form
          onSubmit={addExpensesForm.handleSubmit(addExpenseSubmit)}
          className="space-y-8 sm:w-1/2 bg-blue-100 p-8 rounded-md w-full"
        >
          <div className="flex flex-col gap-12 justify-center">
            {/* Date Field */}
            {/* ... (existing date field code) */}

            {/* Amount Field */}
            <FormField
              control={addExpensesForm.control}
              name="amount"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="3000"
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

            {/* Expense Type Field */}
            <FormField
              control={addExpensesForm.control}
              name="expenseType"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Type</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Rent" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method Field */}
            <FormField
              control={addExpensesForm.control}
              name="paymentMethod"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. UPI" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remark Field */}
            <FormField
              control={addExpensesForm.control}
              name="remark"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    <Input
                      className="border-blue-200"
                      placeholder="eg. Partial payment"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex flex-col items-center justify-between space-y-6">
              <Button
                type="submit"
                value="submit"
                loading={loading}
                variant="outline"
                className="w-full sm:w-1/2 border-blue-200 bg-blue-50"
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
