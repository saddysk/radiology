import * as React from "react";
import { AddRateList } from "./add";

export default async function RatingsAddPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <AddRateList centreId={params.centreId} />;
}
