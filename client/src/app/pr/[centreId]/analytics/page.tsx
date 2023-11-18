import * as React from "react";

import { Analytics } from "./analytics";

export default async function AnalyticsPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Analytics centreId={params.centreId} />;
}
