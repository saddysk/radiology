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
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { auth } from "@/app/api";
import { CreateUserDto, UserRole } from "@/app/api/data-contracts";

const userRoleValues = Object.values(UserRole) as [string, ...string[]];

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
  role: z.enum(userRoleValues),
});

type FormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export function RegisterForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.Admin,
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function onSubmit(data: FormData) {
    setLoading(true);

    try {
      const response = await auth.authControllerRegister(data as CreateUserDto);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        router.push("/dashboards");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 sm:w-1/2 px-4"
      >
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex">
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="border-r-0 rounded-r-none"
                  />
                  <Button
                    variant="outline"
                    className=" rounded-l-none border-zinc-600 border-l-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <Button
            type="submit"
            value="submit"
            loading={loading}
            variant="outline"
            className="w-full sm:w-1/2  border-zinc-600"
          >
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
