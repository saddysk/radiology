"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

import { useAllConnectedCentresData, useUserData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import Nabvbar from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function DoctorDashboard() {
  const router = useRouter();
  const {
    data: dataAllConnectedCentres,
    isLoading: isLoadingAllConnectedCentres,
  } = useAllConnectedCentresData({ enabled: true });

  const { toast } = useToast();
  const { data: user } = useUserData();

  useEffect(() => {
    if (user?.data?.role !== "doctor" && user !== undefined) {
      toast({
        title: `You are not authorized to view this page`,
        variant: "destructive",
      });
      router.push("/");
    }
  }, [user]);
  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <Nabvbar />

      <div className="p-6">
        <h1>All centers connected</h1>
        {!isLoadingAllConnectedCentres ? (
          <div className="flex gap-4 mt-6">
            {dataAllConnectedCentres?.data.map((centre, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-6 border border-blue-200 rounded-md"
                onClick={() => router.push(`/doctor/centre/${centre.id}`)}
              >
                {centre?.name}
              </div>
            ))}
          </div>
        ) : (
          <CenteredSpinner />
        )}
      </div>
    </Card>
  );
}
