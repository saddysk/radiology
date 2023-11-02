"use client";

import { useToast } from "@/components/ui/use-toast";
import { useCentreData } from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { CopyIcon } from "lucide-react";
import UpdateCentreDialog from "@/components/centre/update";

export function AdminCentre({ centreId }: { centreId: string }) {
  const { toast } = useToast();

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
    return <div className="m-10">Centre Not Found!</div>;
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
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold capitalize">{centre.name}</h3>
          <button
            className="flex items-center gap-3 text-xs opacity-80 bg-blue-300 border border-blue-500 rounded px-3 py-1.5"
            onClick={copyCentreNumber}
          >
            {centre.centreNumber}
            <CopyIcon size={14} />
          </button>
        </div>

        {centre && <UpdateCentreDialog centre={centre} />}
      </div>

      <div className="flex items-center">
        <p className="w-40 font-semibold">Email Id :</p>
        <p className="mt-2">{centre.email}</p>
      </div>

      <div className="flex items-center">
        <p className="w-40 font-semibold">Phone Number :</p>
        <p className="mt-2">{centre.phone}</p>
      </div>

      <div className="flex items-center">
        <p className="w-40 font-semibold">Address :</p>
        <p className="mt-2">{Object.values(centre.address).join(", ")}</p>
      </div>
    </div>
  );
}
