import * as React from "react";

import { Patient } from "./patient";

export default async function PatientPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Patient centreId={params.centreId} />;
}
