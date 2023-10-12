import * as React from "react";

import { RateList } from "./ratelist";

export default async function RatelistPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <RateList centreId={params.centreId} />;
}
