import {
  auth,
  booking,
  centre,
  centreexpense,
  drcommission,
  edit,
  patient,
  ratelist,
} from "@/app/api";
import { CommissionDto, UpdateRateListDto } from "@/app/api/data-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// // hooks/useUserData.js
// export const useUserData = () => {
// 	return useQuery({
// 		queryKey: ['user'],
// 		queryFn: getUser,
// 	})
// }

// export const useUserData = ({ enabled }: { enabled: boolean }) => {
//     return useQuery(["user"], auth., {
//         enabled
//     })
// }

export const useGetUserById = (id: string) => {
  return useQuery(["get-user-by-id", id], () => auth.authControllerGetById(id));
};

export const useCentreData = ({
  enabled,
  centreId,
}: {
  enabled: boolean;
  centreId: string;
}) => {
  return useQuery(
    ["centre", centreId],
    () => centre.centreControllerGet(centreId),
    {
      enabled,
    }
  );
};

export const useUserData = ({ centreId }: { centreId: string }) => {
  return useQuery(["user", centreId], () => auth.authControllerGet());
};

export const useUserDetailData = () => {
  return useQuery(["user", "doctor"], () => auth.authControllerGet());
};


export const useAllConnectedCentresData = ({
  enabled,
}: {
  enabled: boolean;
}) => {
  return useQuery(["centres"], centre.centreControllerGetAll, {
    enabled,
  });
};

export const useGetCentreForDoctorData = ({
  centreId,
  doctorId,
  enabled,
}: {
  centreId: string;
  doctorId: string;
  enabled: boolean;
}) => {
  return useQuery(
    ["centres", "doctor", centreId],
    () => drcommission.doctorCommissionControllerGet(centreId, doctorId),
    {
      enabled,
    }
  );
};

// export const useGetAllCentreForDoctorData = ({
//   enabled,
// }: {
//   enabled: boolean;
// }) => {
//   return useQuery(
//     ["centres", "doctor"],
//     () => drcommission.doctorCommissionControllerGetAllCentresForDoctor(),
//     {
//       enabled,
//     }
//   );
// };

export const useAllDoctorsData = ({ enabled }: { enabled: boolean }) => {
  return useQuery(["doctors"], auth.authControllerGetDoctors, {
    enabled,
  });
};

export const useGetAllDoctorsForCentreData = ({
  centreId,
  enabled,
}: {
  centreId: string;
  enabled: boolean;
}) => {
  return useQuery(
    ["doctors", centreId],
    () =>
      drcommission.doctorCommissionControllerGetAllDoctorsForCentre(centreId),
    {
      enabled,
    }
  );
};
// export const useCentreData = ({ enabled }: { enabled: boolean }) => {
//     return useQuery(["centre"], centre.centreControllerGet(), {
//         enabled
//     })
// }

export const useAddAdminToCentre = ({
  centreId,
  onSuccess,
  onError,
}: {
  centreId: string;
  onSuccess: any;
  onError: any;
}) => {
  return useMutation({
    mutationFn: () => centre.centreControllerAddAdmin(centreId),
    onSuccess,
    onError,
  });
};

export const useConnectCenterToDoctor = ({
  centreId,
  doctorId,
  commissions,
  onSuccess,
}: {
  centreId: string;
  doctorId: string;
  commissions: CommissionDto[];
  onSuccess: any;
}) => {
  return useMutation({
    mutationFn: () =>
      drcommission.doctorCommissionControllerAdd({
        doctorId,
        centreId,
        commissions,
      }),
    onSuccess,
  });
};

export const useGetRateList = ({ centreId }: { centreId: string }) => {
  return useQuery({
    queryKey: ["ratelist", centreId],
    queryFn: () => ratelist.rateListControllerGet(centreId),
  });
};

export const useUpdateRateList = ({
  centreId,
  data,
}: {
  centreId: string;
  data: UpdateRateListDto;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ratelist.rateListControllerUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["ratelist", centreId]);
    },
  });
};

export const useCentreExpenses = ({ centreId }: { centreId: string }) => {
  return useQuery({
    queryKey: ["expenses", centreId],
    queryFn: () => centreexpense.expenseControllerGetAll(centreId),
  });
};

export const useCentreExpense = ({
  id,
  centreId,
  enabled,
}: {
  id: string;
  centreId: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["expenses", centreId],
    queryFn: () => centreexpense.expenseControllerGet(id, centreId),
    enabled,
  });
};

export const useEditRequest = ({ centreId }: { centreId: string }) => {
  return useQuery({
    queryKey: ["edit", centreId],
    queryFn: () => edit.updateRequestControllerGet(centreId),
  });
};

export const useCentreBookings = ({ centreId }: { centreId: string }) => {
  return useQuery({
    queryKey: ["bookings", centreId],
    queryFn: () => booking.bookingControllerGet(centreId),
  });
};

export const useGetPatients = ({ centreId }: { centreId: string }) => {
  return useQuery({
    queryKey: ["patients", centreId],
    queryFn: () => patient.patientControllerGet({ centreId }),
  });
};

export const useGetPatienByNumber = ({
  patientNumber,
}: {
  patientNumber: string;
}) => {
  return useQuery({
    queryKey: ["patient-by-number", patientNumber],
    queryFn: () =>
      patient.patientControllerGetByPatientNumber({ patientNumber }),
  });
};

// // hooks/useThreadsData.js
// export const useThreadsData = ({ enabled, funcArgs }) => {
// 	return useQuery({
// 		queryKey: ['threads'],
// 		queryFn: () => readChat(funcArgs),
// 		enabled,
// 		onError: (error) => {
// 			logtail.info('Error getting threads', error)
// 			logtail.flush()
// 		},
// 	})
// }


export const useGetDoctorAnalytics = ({ doctorId, enabled }: { doctorId: string, enabled: boolean }) => {
  return useQuery({
    queryKey: ['analytics', 'doctor', doctorId],
    queryFn: () => booking.bookingControllerGetDoctorReferrals({ doctorId }),
    enabled
  })
}