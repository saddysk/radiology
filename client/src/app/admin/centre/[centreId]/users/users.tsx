"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/app/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateUserDto, UserRole } from "@/app/api/data-contracts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { copyText } from "@/lib/utils";

const userRole = ["admin", "receptionist", "pr", "doctor"];

const createCentreSchema = z.object({
  name: z.string().min(4, "Name needs to be atleast 4 characters long!"),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
  role: z.string(),
});

export function Users({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const createCentreForm = useForm<CreateUserDto>({
    resolver: zodResolver(createCentreSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  async function createCentreSubmit(data: CreateUserDto) {
    setLoading(true);
    try {
      const centerBasedUser = {
        ...data,
        centreId,
      };
      const response = await auth.authControllerRegister(
        data.role == "doctor" ? data : centerBasedUser
      );
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        copyText(`Email: ${data.email}, Password: ${data.password}`);
        toast({
          title: `${response.data.user.role} Created`,
          description: `Copied the user's email and password to clipboard`,
          variant: "default",
        });
        router.refresh();
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
      <h1 className="text-3xl text-center opacity-90 items-center space-x-4 mb-6">
        <span>Add User</span>
      </h1>

      <Form {...createCentreForm}>
        <form
          onSubmit={createCentreForm.handleSubmit(createCentreSubmit)}
          className="space-y-8 sm:w-1/2 px-4 w-full mt-12 bg-blue-100 p-8 py-8 rounded-md justify-center"
        >
          {/* Name */}
          <FormField
            control={createCentreForm.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val); // This should update the form state
                      //setSelectedModality("");}
                    }}
                  >
                    <SelectTrigger className="w-full border border-blue-200 shadow-none bg-blue-50">
                      <SelectValue placeholder="Select a Modality" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-50 border-blue-200">
                      {userRole.map((user, i) => {
                        return (
                          <SelectItem
                            value={user}
                            key={i}
                            className=" capitalize"
                          >
                            {user}
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
            control={createCentreForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createCentreForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createCentreForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
                      className=" rounded-l-none border-blue-200 bg-blue-200 border-l-0"
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
              className="w-full sm:w-1/2 border-blue-200 bg-blue-50"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
