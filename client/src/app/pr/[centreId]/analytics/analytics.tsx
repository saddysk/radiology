"use client";

import { useAllDoctorsData, useGetDoctorAnalytics } from "@/lib/query-hooks";
import { useToast } from "@/components/ui/use-toast";
import { DoctorAnalyticsComponent } from "@/components/analytics/doctor-analytics";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CenteredSpinner from "@/components/ui/centered-spinner";

export function Analytics({ centreId }: { centreId: string }) {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: dataAllDoctors, isLoading: isLoadingAllDoctors } =
    useAllDoctorsData({ enabled: true });

  const { data: dataDoctorAnalytics, isLoading: isDoctorAnalyticsLoading } =
    useGetDoctorAnalytics({
      doctorId: selectedDoctor!,
      enabled: selectedDoctor ? true : false,
    });

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <h1 className="text-4xl text-center opacity-90 flex items-center space-x-4 mt-12">
        <span>Doctor Analytics</span>
      </h1>
      <p className="mt-2 mb-12 opacity-80">
        Click on a doctor to get analytics for that doctor.
      </p>
      <div className="flex flex-wrap gap-8 mx-auto w-full justify-start mb-8">
        {dataAllDoctors?.data?.map((doctor, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center space-x-2 p-6 border border-blue-200 rounded-md",
              selectedDoctor === doctor.id
                ? "border border-blue-800"
                : "cursor-pointer"
            )}
            onClick={() => setSelectedDoctor(doctor.id)}
          >
            {doctor.name}
          </div>
        ))}
      </div>
      <div>
        {selectedDoctor &&
          (isDoctorAnalyticsLoading ? (
            <CenteredSpinner />
          ) : (
            <DoctorAnalyticsComponent data={dataDoctorAnalytics?.data} />
          ))}
      </div>
    </div>
  );
}
