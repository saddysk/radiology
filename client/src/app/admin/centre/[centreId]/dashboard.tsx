"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllConnectedCentresData, useCentreData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";

export function AdminCentre({ centreId }: { centreId: string }) {
  console.log(centreId);
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
    <Card className="flex flex-col m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      <nav className="flex items-center justify-between gap-4 p-6 border-b border-b-zinc-600">
        <h1 className="text-xl text-white">Admin Dashboard</h1>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </nav>

      <div className="p-6 flex justify-center">
        <h1>{dataAllConnectedCentres?.data.name} Centre</h1>
      </div>
    </Card>
  );
}
