import * as React from "react";
import { AddBookings } from "./bookings";

export default async function RatelistPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <AddBookings centreId={params.centreId} />;
}
