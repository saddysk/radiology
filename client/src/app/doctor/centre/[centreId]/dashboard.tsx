"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  useCentreData,
  useGetCentreForDoctorData,
  useUserData,
} from "@/lib/query-hooks";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { CopyIcon } from "lucide-react";
import UpdateCentreDialog from "@/components/centre/update";

export function DoctorCentre({ centreId }: { centreId: string }) {
  const { toast } = useToast();
  const { data: dataUser, isLoading: isLoadingAllUser } = useUserData({
    centreId,
  });
  const { data: dataConnectedCentres, isLoading: isLoadingConnectedCentres } =
    useGetCentreForDoctorData({
      centreId,
      doctorId: dataUser?.data.id!,
      enabled: dataUser ? true : false,
    });

  if (isLoadingConnectedCentres) {
    return <CenteredSpinner />;
  }
  if (dataConnectedCentres == null) {
    return <div className="m-10">Centre Not Found!</div>;
  }

  const centre = dataConnectedCentres.data;
  console.log(dataConnectedCentres);
  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold capitalize">
            {dataUser?.data?.name}
          </h3>
        </div>
      </div>

      <div className="flex items-center mt-2">
        <p className="w-40 font-semibold">Email Id :</p>
        <p>{dataUser?.data?.email}</p>
      </div>

      <div className="flex items-center mt-2">
        <p className="w-40 font-semibold">Centre Name</p>
        <p>{centre[0]?.centre?.name}</p>
      </div>
    </div>
  );
}
