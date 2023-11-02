import * as React from "react";
import { Users } from "./users";

export default async function UsersPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <Users centreId={params.centreId} />;
}
