"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useCentreData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { CopyIcon } from "lucide-react";

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

  if (isLoadingAllConnectedCentres) {
    return <CenteredSpinner />;
  }
  if (dataAllConnectedCentres == null) {
    return <>Centre Not Found!</>;
  }

  const centre = dataAllConnectedCentres.data;

  const copyCentreNumber = () => {
    navigator.clipboard.writeText(centre.centreNumber);
    toast({
      description: "Centre Id copied to clipboard.",
    });
  };

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold capitalize">{centre.name}</h3>
        <button
          className="flex items-center gap-3 text-xs opacity-80 bg-slate-800 rounded px-3 py-1.5"
          onClick={copyCentreNumber}
        >
          {centre.centreNumber}
          <CopyIcon size={14} />
        </button>
      </div>
    </div>
  );
}
