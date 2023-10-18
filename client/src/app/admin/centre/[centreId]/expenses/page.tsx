import * as React from "react";

import { Expenses } from "./expenses";

export default async function RatelistPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Expenses centreId={params.centreId} />;
}
