import * as React from "react";

import { PRDashboard } from "./dashboard";

export default async function PRPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <PRDashboard centreId={params?.centreId} />;
}
