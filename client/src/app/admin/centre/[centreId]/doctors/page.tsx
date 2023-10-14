import * as React from "react";
import { DoctorsList } from "./doctors";

export default async function RatelistPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <DoctorsList centreId={params.centreId} />;
}
