"use client";

import {
  useAllDoctorsData,
  useGetDoctorAnalytics,
  useUserDetailData,
} from "@/lib/query-hooks";
import { useToast } from "@/components/ui/use-toast";
import { DoctorAnalyticsComponent } from "@/components/analytics/doctor-analytics";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Nabvbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import CenteredSpinner from "@/components/ui/centered-spinner";

export function Analytics() {
  const { data: dataUser, isLoading: isLoadingAllUser } = useUserDetailData();
  const { data: dataDoctorAnalytics, isLoading: isDoctorAnalyticsLoading } =
    useGetDoctorAnalytics({
      doctorId: dataUser?.data.id!,
      enabled: dataUser?.data.id ? true : false,
    });
  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <Nabvbar />

      {isDoctorAnalyticsLoading ? (
        <CenteredSpinner />
      ) : (
        <DoctorAnalyticsComponent data={dataDoctorAnalytics?.data} />
      )}
    </Card>
  );
}
