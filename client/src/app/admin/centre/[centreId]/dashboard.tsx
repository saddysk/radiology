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

  return (
    <div>
      <h1>{dataAllConnectedCentres?.data.name} Centre</h1>
    </div>
  );
}
