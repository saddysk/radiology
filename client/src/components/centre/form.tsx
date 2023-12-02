import { FC, useEffect } from "react";
import { CentreDto, CreateCentreDto } from "@/app/api/data-contracts";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { centre } from "@/app/api";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CentreCreateUpdateFormProps {
  centreDetails?: CentreDto;
  onUpdated?: (value: boolean) => void;
}

const createCentreSchema = z.object({
  name: z.string().min(4, "Name needs to be at least 4 characters long!"),
  email: z.string().email(),
  phone: z
    .string()
    .refine((value) => /^[1-9]\d{9}$/.test(value), "Phone number is invalid."),
  address: z.object({
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    postalCode: z.number().max(6, "Postal code cant be more than 6"),
    state: z.string(),
    country: z.string().nullable(),
  }),
});

const CentreCreateUpdateForm: FC<CentreCreateUpdateFormProps> = ({
  centreDetails,
  onUpdated,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateCentreDto>({
    resolver: zodResolver(createCentreSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      address: {
        line1: "",
        line2: "",
        city: "",
        postalCode: undefined,
        state: "",
      },
    },
  });

  useEffect(() => {
    if (centreDetails) {
      form.setValue("name", centreDetails.name);
      form.setValue("email", centreDetails.email);
      form.setValue("phone", centreDetails.phone.replace(/\D/g, "").slice(-10));
      form.setValue("address.line1", centreDetails.address.line1);
      form.setValue("address.line2", centreDetails.address.line2);
      form.setValue("address.city", centreDetails.address.city);
      form.setValue("address.postalCode", centreDetails.address.postalCode);
      form.setValue("address.state", centreDetails.address.state);
      form.setValue("address.country", centreDetails.address.country);
    }
  }, [centreDetails, form]);

  const redirectOnSuccess = (message: string) => {
    toast({
      title: message,
      variant: "default",
    });
    router.push("/admin/dashboard");
  };

  const mutateFn = (data: CreateCentreDto) =>
    centreDetails
      ? centre.centreControllerUpdate({ id: centreDetails.id, ...data })
      : centre.centreControllerCreate(data);

  const { mutate, isLoading: loading } = useMutation(mutateFn, {
    onSuccess: () => {
      if (centreDetails) {
        queryClient.invalidateQueries(["centre", centreDetails.id]);
        toast({
          description: "Centre details updated",
          variant: "default",
        });
        onUpdated?.(false);
      } else {
        redirectOnSuccess("Centre Created");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: CreateCentreDto) {
    data.phone = `+91${data.phone}`;

    mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4 px-4", centreDetails ? "w-full" : "w-1/2")}
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
                <Input
                  placeholder="Enter your phone"
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Use a regular expression to check if the input value is numeric
                    if (/^\d*\.?\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
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
                  onChange={(e) => {
                    const value = e.target.value;
                    // Use a regular expression to check if the input value is numeric
                    if (/^\d*\.?\d*$/.test(value)) {
                      const numberValue = Number(value);
                      field.onChange(numberValue);
                    }
                  }}
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
            className={cn(
              "w-full sm:w-1/2 border-blue-200",
              centreDetails && "bg-blue-50"
            )}
          >
            {centreDetails ? "Save changes" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CentreCreateUpdateForm;
