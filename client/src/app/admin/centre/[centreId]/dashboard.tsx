"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllConnectedCentresData, useCentreData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";

export function AdminCentre({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    data: dataAllConnectedCentres,
    isLoading: isLoadingAllConnectedCentres,
  } = useCentreData({
    centreId,
    enabled: centreId ? true : false,
  });
  console.log(dataAllConnectedCentres);
  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <h3 className="text-xl font-bold mb-4">
        {dataAllConnectedCentres?.data.name} Centre{" "}
      </h3>
      <h3 className="text-sm mb-4 opacity-80">
        {dataAllConnectedCentres?.data.id}
      </h3>
    </div>
  );
}
