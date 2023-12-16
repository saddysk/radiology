"use client";

import {
  useAllDoctorsData,
  useCentreBookings,
  useCentreExpenses,
  useGetAllDoctorsForCentreData,
  useGetDoctorAnalytics,
} from "@/lib/query-hooks";
import { useToast } from "@/components/ui/use-toast";
import { DoctorAnalyticsComponent } from "@/components/analytics/doctor-analytics";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingDto, DoctorCommissionDto } from "@/app/api/data-contracts";
import { DoctorsAnalyticsComponent } from "@/components/analytics/doctors-analytics";
import { ExpenseAnalyticsComponent } from "@/components/analytics/expense-analytics";
import { CollectionAnalyticsComponent } from "@/components/analytics/collection-analytics";

export function Analytics({ centreId }: { centreId: string }) {
  const [tab, setTab] = useState("doctor");

  const tabsList = [
    {
      name: "Doctor Analytics",
      value: "doctor",
    },
    {
      name: "Doctors Analytics",
      value: "doctors",
    },
    {
      name: "Expenses",
      value: "expenses",
    },
    {
      name: "Collection",
      value: "collection",
    },
  ];

  const tabContent = "p-6 bg-blue-100 rounded-md mt-4";
  return (
    <div className="w-full h-[85vh] overflow-scroll p-8">
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabsList className="h-full grid w-[80vw] grid-cols-4 bg-blue-100 p-2">
          {tabsList.map(({ name, value }) => {
            return (
              <TabsTrigger
                key={value}
                className={cn(
                  tab == value && "bg-blue-300 font-bold rounded-md "
                )}
                value={value}
              >
                {name}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent className={tabContent} value="doctor">
          <DoctorAnalytics centreId={centreId} />
        </TabsContent>
        <TabsContent className={tabContent} value="doctors">
          <DoctorsAnalytics centreId={centreId} />
        </TabsContent>
        <TabsContent className={tabContent} value="expenses">
          <ExpenseAnalytics centreId={centreId} />
        </TabsContent>
        <TabsContent className={tabContent} value="collection">
          <CollectionAnalytics centreId={centreId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const DoctorAnalytics = ({ centreId }: { centreId: string }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: dataAllDoctors, isLoading: isLoadingAllDoctors } =
    useGetAllDoctorsForCentreData({ centreId, enabled: true });

  const { data: dataDoctorAnalytics, isLoading: isDoctorAnalyticsLoading } =
    useGetDoctorAnalytics({
      doctorId: selectedDoctor!,
      enabled: selectedDoctor ? true : false,
    });

  const filterData = () => {
    const dataMap = new Map();
    const filteredData: DoctorCommissionDto[] = [];

    dataAllDoctors?.data?.forEach((e) => {
      if (!dataMap.has(e.doctorId)) {
        dataMap.set(e.doctorId, true);
        filteredData.push(e);
      }
    });

    return filteredData;
  };

  const filteredData = filterData();
  return (
    <div>
      <p className="text-lg mb-6 opacity-80">
        Click on a doctor to get analytics for that doctor.
      </p>
      <div className="flex flex-wrap gap-4 mx-auto w-full justify-start">
        {filteredData?.map((doctor, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center space-x-2 px-6 py-4 border border-blue-200 rounded-md bg-blue-50",
              selectedDoctor === doctor.id
                ? "border-2 border-blue-300"
                : "cursor-pointer"
            )}
            onClick={() => setSelectedDoctor(doctor.doctorId)}
          >
            {doctor.doctor?.name}
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="bg-blue-50 px-4 py-1 rounded-md mt-4 pb-4">
          {isDoctorAnalyticsLoading ? (
            <CenteredSpinner />
          ) : (
            <DoctorAnalyticsComponent data={dataDoctorAnalytics?.data} />
          )}
        </div>
      )}
    </div>
  );
};

const DoctorsAnalytics = ({ centreId }: { centreId: string }) => {
  const { toast } = useToast();

  const { data: dataCentreBookings, isLoading: isLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  return (
    <div>
      <div className="bg-blue-50 px-4 py-1 rounded-md mt-2 pb-4">
        {false ? (
          <CenteredSpinner />
        ) : (
          <DoctorsAnalyticsComponent data={dataCentreBookings?.data} />
        )}
      </div>
    </div>
  );
};

const ExpenseAnalytics = ({ centreId }: { centreId: string }) => {
  const { data: dataCentreExpenses, isLoading: IsLoadingCentreExpenses } =
    useCentreExpenses({
      centreId,
    });

  return (
    <div>
      <div className="bg-blue-50 px-4 py-1 rounded-md mt-2 pb-4">
        {false ? (
          <CenteredSpinner />
        ) : (
          <ExpenseAnalyticsComponent data={dataCentreExpenses?.data} />
        )}
      </div>
    </div>
  );
};

const CollectionAnalytics = ({ centreId }: { centreId: string }) => {
  const { data: dataCentreBookings, isLoading: isLoadingCentreBookings } =
    useCentreBookings({
      centreId,
    });

  return (
    <div>
      <div className="bg-blue-50 px-4 py-1 rounded-md mt-2 pb-4">
        {false ? (
          <CenteredSpinner />
        ) : (
          <CollectionAnalyticsComponent data={dataCentreBookings?.data} />
        )}
      </div>
    </div>
  );
};
