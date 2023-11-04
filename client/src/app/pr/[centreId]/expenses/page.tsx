import * as React from "react";

import { Expenses } from "./expenses";

export default async function ExpensesPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Expenses centreId={params.centreId} />;
}
