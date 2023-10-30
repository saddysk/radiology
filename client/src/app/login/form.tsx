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
import { auth } from "@/app/api";
import { LoginUserDto, UserRole } from "@/app/api/data-contracts";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
});

export function LoginForm() {
  const form = useForm<LoginUserDto>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data: LoginUserDto) {
    setLoading(true);

    try {
      const response = await auth.authControllerLogin(data);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        localStorage.setItem("x-session-token", response.data.token);
        toast({
          title: "Admin Registered",
          variant: "default",
        });
        if (response.data.user.role === UserRole.Admin) {
          router.push(`/admin/onboarding`);
        }
        if (response.data.user.role === UserRole.Pr) {
          router.push(`/pr/dashboard`);
        }
        if (response.data.user.role === UserRole.Doctor) {
          router.push(`/doctor/dashboard`);
        }
      }
    } catch (error: any) {
      if (error.response.status === 423) {
        router.push(`/reset-password/${error.response.data.message}`);
        toast({
          title: "First time login",
          description: "Please reset password for the first time",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 sm:w-1/3 px-4"
      >
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
                    type="button"
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

        <div className="flex flex-col items-center justify-between space-y-6">
          <Button
            type="submit"
            value="submit"
            loading={loading}
            variant="outline"
            className="w-full sm:w-1/2  border-zinc-600"
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
