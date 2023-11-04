import * as React from "react";

import { ReceptionistDashboard } from "./dashboard";

export default async function RegisterPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <ReceptionistDashboard centreId={params?.centreId} />;
}
