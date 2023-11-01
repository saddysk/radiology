"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useAllConnectedCentresData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import Nabvbar from "@/components/navbar";

export function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    data: dataAllConnectedCentres,
    isLoading: isLoadingAllConnectedCentres,
  } = useAllConnectedCentresData({
    enabled: true,
  });

  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <Nabvbar />

      <div className="p-6">
        <h1>All centers connected</h1>
        {!isLoadingAllConnectedCentres ? (
          <div className="flex gap-6 mt-8">
            {dataAllConnectedCentres?.data.map((centre, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-6 border border-blue-200 rounded-md"
                onClick={() => router.push(`/admin/centre/${centre.id}`)}
              >
                {centre.name}
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
