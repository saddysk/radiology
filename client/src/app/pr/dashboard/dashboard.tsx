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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { auth, centre, drcommission } from "@/app/api";
import {
  CreateCentreDto,
  CreateDoctorCommissionDto,
  CreateUserDto,
  DoctorCommissionDto,
  UserRole,
} from "@/app/api/data-contracts";
import { Card } from "@/components/ui/card";
import {
  addAdminToCentre,
  connectCenterToDoctor,
  useAllCentresData,
  useAllDoctorsData,
} from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { copyText } from "@/lib/utils";

const createCentreSchema = z.object({
  name: z.string().min(4, "Name needs to be atleast 4 characters long!"),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^[\d!#$%&*@A-Z^a-z]*$/, "Invalid password format."),
  role: z.string(),
});

const CommissionSchema = z.object({
  modality: z.string(),
  amount: z.number(),
});

const addDoctorToCentreSchema = z.object({
  doctorId: z.string().uuid(),
  centreId: z.string().uuid(),
  commissions: z.array(CommissionSchema),
});

export function PRDashboard() {
  const createCentreForm = useForm<CreateUserDto>({
    resolver: zodResolver(createCentreSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.Doctor,
    },
  });

  const addDoctorToCentreForm = useForm<CreateDoctorCommissionDto>({
    resolver: zodResolver(addDoctorToCentreSchema),
    defaultValues: {
      doctorId: "",
      centreId: "",
      commissions: [
        {
          modality: "x-ray",
          amount: 0,
        },
        {
          modality: "ct-scan",
          amount: 0,
        },
        {
          modality: "usg",
          amount: 0,
        },
      ],
    },
  });

  console.log(addDoctorToCentreForm.formState.errors);
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function createCentreSubmit(data: CreateUserDto) {
    setLoading(true);
    try {
      const response = await auth.authControllerRegister(data);
      console.log(response);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        copyText(`Email: ${data.email}, Password: ${data.password}`);
        toast({
          title: `Doctor Created`,
          description: `Copied the doctor's email and password to clipboard`,
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

  async function addDoctorToCentreSubmit(data: CreateDoctorCommissionDto) {
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
  const [selectedFlow, setSelectedFlow] = useState<"create" | "join" | null>(
    null
  );

  const { data: dataAllCentres, isLoading: isLoadingAllCentres } =
    useAllCentresData({ enabled: selectedFlow == "join" });

  const { data: dataAllDoctors, isLoading: isLoadingAllDoctors } =
    useAllDoctorsData({ enabled: selectedFlow == "join" });

  return (
    <Card className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      {selectedFlow == null && (
        <div className="flex gap-8">
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-zinc-950 border-zinc-600"
            onClick={() => setSelectedFlow("create")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Create Doctor
            </h1>
          </Card>
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-zinc-950 border-zinc-600"
            onClick={() => setSelectedFlow("join")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Join Doctor to Centre
            </h1>
          </Card>
        </div>
      )}
      {selectedFlow == "create" && (
        <div className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600 w-[100%]">
          <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
            <span>Create Doctor</span>
          </h1>
          <Form {...createCentreForm}>
            <form
              onSubmit={createCentreForm.handleSubmit(createCentreSubmit)}
              className="space-y-8 sm:w-1/2 px-4 w-full"
            >
              {/* Name */}
              <FormField
                control={createCentreForm.control}
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
                control={createCentreForm.control}
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
                control={createCentreForm.control}
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
          <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mb-12">
            <span>Connect Doctor to Centre</span>
          </h1>
          <Form {...addDoctorToCentreForm}>
            <form
              onSubmit={addDoctorToCentreForm.handleSubmit(
                addDoctorToCentreSubmit
              )}
              className="space-y-8 sm:w-1/2 px-4 w-full"
            >
              {!isLoadingAllCentres && !isLoadingAllDoctors ? (
                <div className="flex flex-col gap-12 justify-center">
                  <FormField
                    control={addDoctorToCentreForm.control}
                    name="centreId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                          >
                            {dataAllCentres?.data?.map((centre, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 p-6 border border-white rounded-md"
                              >
                                <RadioGroupItem
                                  value={centre.id}
                                  id={centre.id}
                                />
                                <Label htmlFor={centre.id} className="text-lg">
                                  {centre.name}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addDoctorToCentreForm.control}
                    name="doctorId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                          >
                            {dataAllDoctors?.data?.map((doctor, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 p-6 border border-white rounded-md"
                              >
                                <RadioGroupItem
                                  value={doctor.id}
                                  id={doctor.id}
                                />
                                <Label htmlFor={doctor.id} className="text-lg">
                                  {doctor.name}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <h2>Commissions</h2>
                  <div className="flex flex-col gap-4">
                    {addDoctorToCentreForm
                      .watch("commissions")
                      .map((commission, index) => (
                        <FormField
                          control={addDoctorToCentreForm.control}
                          name={`commissions.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="grid grid-cols-[1fr_3fr] gap-2 justify-normal items-center">
                                  <h3 className="uppercase">
                                    {commission.modality}
                                  </h3>
                                  <Input
                                    placeholder="Amount"
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                      const numberValue = Number(
                                        e.target.value
                                      );
                                      field.onChange(numberValue);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                          key={index}
                        />
                      ))}
                  </div>
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
      )}
    </Card>
  );
}