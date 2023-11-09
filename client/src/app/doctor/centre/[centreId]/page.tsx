import * as React from "react";

import { DoctorCentre } from "./dashboard";

export default async function CentrePage({
  params,
}: {
  params: { centreId: string };
}) {
  return <DoctorCentre centreId={params.centreId} />;
}
