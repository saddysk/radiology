"use client";

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAddAdminToCentre } from "@/lib/query-hooks";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface JoinCentreFormProps {}

const JoinCentreForm: FC<JoinCentreFormProps> = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [centreSelected, setCentreSelected] = useState<string | null>(null);

  const { mutate: mutateAdminToCentre, isLoading: isLoadingAdminToCentre } =
    useAddAdminToCentre({
      centreId: centreSelected!,
      onSuccess: () => {
        toast({
          title: "Joined to the centre",
          variant: "default",
        });
        router.push("/admin/dashboard");
      },
      onError: (error: any) =>
        toast({
          title: "Error!",
          description:
            error.response.data.statusCode === 400
              ? error.response.data.message
              : "Failed to join centre. Please verify the centre id before joining.",
          variant: "destructive",
        }),
    });

  return (
    <Card className="m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <div className="flex flex-col items-center justify-center py-28 space-y-6 mx-auto h-full rounded-md bg-blue-50 border-blue-200 sm:w-1/3 w-full">
        <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
          <span>Join Center</span>
        </h1>

        <Input
          placeholder="Enter Centre Id"
          autoFocus
          onChange={(e) => setCentreSelected(e.target.value)}
        />

        <Button
          loading={isLoadingAdminToCentre}
          variant="outline"
          className="w-full sm:w-1/2 border-blue-200"
          onClick={() => {
            centreSelected == null
              ? toast({
                  title: "Error!",
                  description: "Please enter a centre id.",
                  variant: "destructive",
                })
              : mutateAdminToCentre();
          }}
        >
          Join
        </Button>
      </div>
    </Card>
  );
};

export default JoinCentreForm;
