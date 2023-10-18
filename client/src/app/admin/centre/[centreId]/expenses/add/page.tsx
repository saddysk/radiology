import * as React from "react";
import { AddExpenses } from "./add";

export default async function RatelistPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <AddExpenses centreId={params.centreId} />;
}
