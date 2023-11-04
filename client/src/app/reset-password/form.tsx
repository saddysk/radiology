"use client";

import { FC, useEffect, useState } from "react";
import { useGetUserById } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResetPasswordDto, UserRole } from "../api/data-contracts";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../api";

interface ResetPasswordFormProps {
  userId: string;
}

interface ConfirmResetPasswordDto extends ResetPasswordDto {
  confirmPassword: string;
}

const resetPasswordSchema = z.object({
  password: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
  confirmPassword: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
});

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ userId }) => {
  const form = useForm<ConfirmResetPasswordDto>({
    // TODO: add validator
    // resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: undefined,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { data: userData, isLoading } = useGetUserById(userId);

  const { toast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      form.setValue("email", userData?.data.email);
    }
  }, [userData, form]);

  const { mutate, isLoading: loading } = useMutation(
    auth.authControllerResetPassword,
    {
      onSuccess: (response) => {
        localStorage.setItem("x-session-token", response.data.token);
        toast({
          title: `${response.data.user.role} Registered`,
          variant: "default",
        });
        if (response.data.user.role === UserRole.Admin) {
          router.push(`/admin/onboarding`);
        }
        if (response.data.user.role === UserRole.Pr) {
          router.push(`/pr/${response.data.user.centreId}/dashboard`);
        }
        if (response.data.user.role === UserRole.Receptionist) {
          router.push(`/receptionist/${response.data.user.centreId}/dashboard`);
        }
        if (response.data.user.role === UserRole.Doctor) {
          router.push(`/doctor/dashboard`);
        }
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response.data.statuCode === 400
              ? error.response.data.message
              : "Something went wrong",
          variant: "destructive",
        });
      },
    }
  );

  async function onSubmit(data: ConfirmResetPasswordDto) {
    const { email, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast({
        description: "Password do not match.",
        variant: "destructive",
      });
    }

    mutate({ email, newPassword });
  }

  if (isLoading) {
    return <CenteredSpinner />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:w-1/3 px-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex">
                  <Input
                    placeholder="Enter new password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="border-r-0 rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className=" rounded-l-none bg-blue-200 border-blue-300 border-l-0"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex">
                  <Input
                    placeholder="Confirm password"
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    className="border-r-0 rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className=" rounded-l-none bg-blue-200 border-blue-300 border-l-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
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
            loading={loading}
            variant="outline"
            className="w-full sm:w-1/2  bg-blue-200 border-blue-300"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
