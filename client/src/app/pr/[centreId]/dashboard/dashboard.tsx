"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { auth, drcommission } from "@/app/api";
import {
  CreateDoctorCommissionDto,
  CreateUserDto,
  UserRole,
} from "@/app/api/data-contracts";
import { Card } from "@/components/ui/card";
import {
  useAllConnectedCentresData,
  useAllDoctorsData,
} from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { copyText } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeftIcon } from "lucide-react";

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
  letGo: z.boolean(),
});

export function PRDashboard({ centreId }: { centreId: string }) {
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
      letGo: false,
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function createCentreSubmit(data: CreateUserDto) {
    setLoading(true);
    try {
      const response = await auth.authControllerRegister(data);
      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        copyText(`Email: ${data.email}, Password: ${data.password}`);
        toast({
          title: `Doctor Created`,
          description: `Copied the doctor's email and password to clipboard`,
          variant: "default",
        });
        router.push(`/pr/${centreId}/dashboard`);
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

  async function addDoctorToCentreSubmit(data: CreateDoctorCommissionDto) {
    setLoading(true);
    try {
      const response = await drcommission.doctorCommissionControllerAdd(data);

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        toast({
          title: `Doctor added to centre`,
          variant: "default",
        });
        setSelectedFlow(null);
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description:
          error.response.data.statusCode === 400
            ? error.response.data.message
            : "Can not add connect doctor to the centre",
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

  // const { data: dataAllCentres, isLoading: isLoadingAllCentres } =
  //   useAllCentresData({ enabled: selectedFlow == "join" });

  const { data: dataAllDoctors, isLoading: isLoadingAllDoctors } =
    useAllDoctorsData({ enabled: selectedFlow == "join" });

  console.log(dataAllDoctors, "hereee");
  const { data: dataAllCentres, isLoading: isLoadingAllCentres } =
    useAllConnectedCentresData({ enabled: selectedFlow == "join" });

  return (
    <div className="w-full h-full max-h-[calc(100vh-112px)]  relative">
      {selectedFlow != null && (
        <button
          onClick={() => setSelectedFlow(null)}
          className="ml-4 mt-4 absolute top-5 left-5 z-10"
        >
          <ArrowLeftIcon />
        </button>
      )}
      {selectedFlow == null && (
        <div className="flex h-full items-center gap-8 p-8 justify-center">
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-blue-50 border-blue-200"
            onClick={() => setSelectedFlow("create")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Create Doctor
            </h1>
          </Card>
          <Card
            className="flex flex-col items-center justify-center rounded-md p-10 bg-blue-50 border-blue-200"
            onClick={() => setSelectedFlow("join")}
          >
            <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
              Join Doctor to Centre
            </h1>
          </Card>
        </div>
      )}
      {selectedFlow == "create" && (
        <div className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-blue-50 border-blue-200 w-[100%]">
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
                          className=" rounded-l-none border-blue-200 border-l-0"
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
                  className="w-full sm:w-1/2 border-blue-200"
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {selectedFlow == "join" && (
        <div className="flex flex-col items-center space-y-6 rounded-md bg-blue-50 overflow-auto h-full border-blue-200 w-[100%]">
          <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 my-12">
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
                        <FormLabel className="text-lg">Centre</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                          >
                            {dataAllCentres?.data?.map((centre, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 p-6 border border-blue-200 rounded-md"
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
                        <FormLabel className="text-lg">Doctor</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={(value) => field.onChange(value)}
                            className="flex flex-wrap gap-8 max-w-[60vw] mx-auto w-full justify-start"
                          >
                            {dataAllDoctors?.data?.map((doctor, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 p-6 border border-blue-200 rounded-md"
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

                  <FormField
                    control={addDoctorToCentreForm.control}
                    name="letGo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-blue-200 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Let go of commissions for this doctor and discount
                            the patients
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col items-center justify-between space-y-6">
                    <Button
                      type="submit"
                      value="submit"
                      loading={loading}
                      variant="outline"
                      className="w-full sm:w-1/2 border-blue-200 mb-8"
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
    </div>
  );
}
