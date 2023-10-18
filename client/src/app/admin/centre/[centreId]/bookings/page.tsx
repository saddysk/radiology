import * as React from "react";

import { Bookings } from "./bookings";

export default async function BookingsPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Bookings centreId={params.centreId} />;
}
