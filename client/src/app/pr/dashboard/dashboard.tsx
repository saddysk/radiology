"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useAllConnectedCentresData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import Nabvbar from "@/components/navbar";
import Link from "next/link";

export function PrDashboard() {
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
        <div className="flex items-center justify-between">
          <h1>All centers connected</h1>
          <Link
            href="/pr/centre/join"
            className="flex items-center gap-3 text-sm opacity-80 bg-blue-300 border border-blue-500 rounded px-3 py-1.5"
          >
            Join new centre
          </Link>
        </div>
        {!isLoadingAllConnectedCentres ? (
          <div className="flex gap-6 mt-8">
            {dataAllConnectedCentres?.data.map((centre, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-6 border border-blue-200 rounded-md cursor-pointer"
                onClick={() => router.push(`/pr/${centre.id}/dashboard`)}
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
