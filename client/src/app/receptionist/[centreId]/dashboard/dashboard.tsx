"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useAllConnectedCentresData, useUserData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import Nabvbar from "@/components/navbar";
import Link from "next/link";

export function ReceptionistDashboard({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: dataAllUser, isLoading: isLoadingAllUser } = useUserData();
  const user = dataAllUser?.data;

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold capitalize">{user?.name}</h3>
        </div>
      </div>

      <div className="flex items-center mt-2">
        <p className="w-40 font-semibold">Name :</p>
        <p>{user?.name}</p>
      </div>
      <div className="flex items-center mt-2">
        <p className="w-40 font-semibold">Email Id :</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}
