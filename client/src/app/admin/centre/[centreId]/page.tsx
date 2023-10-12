import * as React from "react";

import { AdminCentre } from "./dashboard";

export default async function CentrePage({
  params,
}: {
  params: { centreId: string };
}) {
  return <AdminCentre centreId={params.centreId} />;
}
