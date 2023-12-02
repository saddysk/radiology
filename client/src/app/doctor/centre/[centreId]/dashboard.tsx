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
    useCentreData({
      centreId,
      enabled: centreId ? true : false,
    });

  const { data: dataCentreDetails, isLoading: isLoadingCentreDetails } =
    useGetCentreForDoctorData({
      centreId,
      doctorId: dataUser?.data.id!,
      enabled: dataUser ? true : false,
    });
  console.log(dataCentreDetails);
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
        <p className="w-40 font-semibold">Centre Name:</p>
        <p>{centre.name}</p>
      </div>
      <p className="font-semibold mt-6 mb-2">
        {dataCentreDetails?.data[0]?.letGo
          ? "Let go of referall money is set"
          : "Referral Percentages : "}
      </p>
      {!dataCentreDetails?.data[0]?.letGo && (
        <div className="flex flex-wrap items-center border border-blue-200 p-2 w-[fit-content]">
          {dataCentreDetails?.data?.map((e, index) => (
            <div
              key={index}
              className="border border-gray-300 m-2 p-4 px-8 rounded shadow-sm"
            >
              <div className="uppercase text-blue-600 font-semibold">
                {e.modality}
              </div>
              <div className="text-gray-800">{e?.amount}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
