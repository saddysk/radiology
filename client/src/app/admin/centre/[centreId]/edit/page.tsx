import * as React from "react";

import { EditReq } from "./edit";

export default async function EditReqPage({
  params,
}: {
  params: { centreId: string };
}) {
  return <EditReq centreId={params.centreId} />;
}
