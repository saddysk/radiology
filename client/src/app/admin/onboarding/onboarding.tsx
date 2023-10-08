"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { centre } from "@/app/api";
import {
  CreateCentreDto,
  CreateUserDto,
  UserRole,
} from "@/app/api/data-contracts";
import { Card } from "@/components/ui/card";
import { useAllCentresData } from "@/lib/query-hooks";

const createCentreSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long!"),
  email: z.string().email(),
  phone: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    postalCode: z
      .string()
      .refine(
        (value: any) => /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(value),
        "Postal code format is invalid."
      ),
    state: z.string(),
    country: z.string().nullable(),
  }),
});

export function AdminOnboarding() {
  const form = useForm<CreateCentreDto>({
    resolver: zodResolver(createCentreSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        postalCode: 123456,
        state: "",
      },
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: CreateCentreDto) {
    console.log("derfvv");
    setLoading(true);

    try {
      const response = await centre.centreControllerCreate(data);
      console.log(response);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Centre Created`,
          variant: "default",
        });
        router.push("/admin/dashboard");
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
  const [selectedFlow, setSelectedFlow] = useState<"create" | "join" | null>(
    null
  );

  const { data: dataAllCentres, isLoading: isLoadingAllCentres } =
    useAllCentresData({ enabled: true });

  console.log(dataAllCentres, "heree");
  return (
    <Card className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      {selectedFlow == null && (
        <div className="flex gap-8">
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-zinc-950 border-zinc-600"
            onClick={() => setSelectedFlow("create")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Create Center
            </h1>
          </Card>
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-zinc-950 border-zinc-600"
            onClick={() => setSelectedFlow("join")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Join Center
            </h1>
          </Card>
        </div>
      )}
      {selectedFlow == "create" && (
        <div className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%]">
          <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
            <span>Create Center</span>
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 sm:w-1/2 px-4 w-full"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name="address.line1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Address Line 1"
                        {...field}
                        name="address-line1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name="address.line2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Address Line 2"
                        {...field}
                        name="address-line2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Postal Code */}
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Postal Code"
                        {...field}
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter Country" {...field} />
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
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {selectedFlow == "join" && (
        <div className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%]">
          <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
            <span>Join Center</span>
          </h1>
        </div>
      )}
    </Card>
  );
}
