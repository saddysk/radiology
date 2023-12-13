"use client";

import {
  useCentreBooking,
  useCentreBookings,
  useCentreExpense,
  useEditRequest,
} from "@/lib/query-hooks";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  RequestStatus,
  RequestType,
  UpdateRequestDto,
} from "@/app/api/data-contracts";
import ReactDiffViewer from "react-diff-viewer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { edit } from "@/app/api";
import clsx from "clsx";

export function EditReq({ centreId }: { centreId: string }) {
  const [visibleColumns, setVisibleColumns] = useState({
    expenseId: true,
    expenseType: true,
    paymentMethod: true,
    amount: true,
    createdAt: false,
    date: true,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<UpdateRequestDto | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { data: dataEdit, isLoading: isLoadingDataEdit } = useEditRequest({
    centreId,
  });

  const { data: expense } = useCentreExpense({
    id: selectedRequest?.requestData?.id!,
    centreId,
    enabled:
      selectedRequest?.type == RequestType.Expense &&
      selectedRequest.status !== RequestStatus.Accepted
        ? true
        : false,
  });

  const { data: booking } = useCentreBooking({
    id: selectedRequest?.requestData?.id!,
    centreId,
    enabled:
      selectedRequest?.type == RequestType.Booking &&
      selectedRequest.status !== RequestStatus.Accepted
        ? true
        : false,
  });

  const [newData, setNewData] = useState<any>("");
  const [pastData, setPastData] = useState<any>("");

  useEffect(() => {
    console.log(
      selectedRequest,
      "heheh",
      selectedRequest?.status == RequestStatus.Accepted
    );
    if (selectedRequest?.type === RequestType.Expense) {
      if (selectedRequest?.status == RequestStatus.Accepted) {
        setPastData(
          JSON.stringify(
            {
              name: selectedRequest?.pastData?.name,
              amount: selectedRequest?.pastData?.amount,
              expenseType: selectedRequest?.pastData?.expenseType,
              paymentMethod: selectedRequest?.pastData?.paymentMethod,
            },
            null,
            4
          )
        );
      } else {
        setPastData(
          JSON.stringify(
            {
              name: expense?.data.name,
              amount: expense?.data.amount,
              expenseType: expense?.data.expenseType,
              paymentMethod: expense?.data.paymentMethod,
            },
            null,
            4
          )
        );
      }
      setNewData(
        JSON.stringify(
          {
            name: selectedRequest?.requestData?.name,
            amount: selectedRequest?.requestData?.amount,
            expenseType: selectedRequest?.requestData?.expenseType,
            paymentMethod: selectedRequest?.requestData?.paymentMethod,
          },
          null,
          4
        )
      );
    }
  }, [selectedRequest, expense, booking]);

  const updateRequest = async ({
    id,
    selection,
  }: {
    id: string;
    selection: boolean;
  }) => {
    try {
      setLoading(true);

      const response = await edit.updateRequestControllerUpdate(id, {
        status: selection ? RequestStatus.Accepted : RequestStatus.Rejected,
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["edit", centreId]);
        toast({
          title: "Edit Request Updated Successfully",
          variant: "default",
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      //localStorage.removeItem("x-session-token");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[85vh] p-8 overflow-y-scroll">
      <div className="w-full flex">
        <Link href={`/admin/centre/${centreId}/expenses/add`}>
          <Button className="bg-blue-50 text-blue-950 hover:opacity-80 ml-auto border border-blue-200 shadow-none">
            Add New Expense
          </Button>
        </Link>{" "}
      </div>
      <div className="p-6 my-4 rounded-lg   bg-blue-100">
        <div className="flex justify-between mb-4 items-center">
          {" "}
          <h3 className="text-xl font-bold uppercase">Edit Requests</h3>
          <div className="w-[20vw]">
            <Input
              type="text"
              placeholder="Search edit requests by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </div>
        </div>

        <Table>
          {dataEdit?.data.length == 0 && (
            <TableCaption className="w-full">
              No data in this table
            </TableCaption>
          )}

          <TableHeader>
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Requested By</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Requested On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Options</TableHead>
          </TableHeader>

          <TableBody>
            {dataEdit?.data.map((request) => (
              <TableRow key={request.id}>
                {/* <TableCell>{request.id}</TableCell> */}
                <TableCell>{request.requestedBy}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.createdAt}</TableCell>
                <TableCell>
                  <p
                    className={clsx(
                      request.status == RequestStatus.Rejected &&
                        "bg-red-500/30",
                      request.status == RequestStatus.Accepted &&
                        "bg-green-500/30",
                      "px-4 py-2 text-center rounded-md w-fit"
                    )}
                  >
                    {request.status.toUpperCase()}
                  </p>
                </TableCell>
                <TableCell className="space-x-4 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 border border-blue-300"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Changes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[80vw] bg-blue-50">
                      <DialogHeader>
                        <DialogTitle>View Changes </DialogTitle>
                        <DialogDescription>
                          {selectedRequest?.status == RequestStatus.Pending &&
                            "You can view the changes here"}
                          {selectedRequest?.status == RequestStatus.Accepted &&
                            "You can view accepted changes here"}
                          {selectedRequest?.status == RequestStatus.Rejected &&
                            "You can view rejected changes here"}
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <p className=" text-blue-950 bg-blue-300 p-6 py-2 w-fit">
                          Status: {selectedRequest?.status.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold pb-6">
                            Comparison{" "}
                            <span className="font-normal">
                              {selectedRequest?.status ==
                                RequestStatus.Pending &&
                                "(Current Data vs Requested Data)"}
                              {selectedRequest?.status ==
                                RequestStatus.Accepted &&
                                "(Past Data vs Accepted Data)"}
                              {selectedRequest?.status ==
                                RequestStatus.Rejected &&
                                "(Current Data vs Rejected Data)"}
                            </span>
                          </h3>
                          {newData !== "" && pastData !== "" && (
                            <ReactDiffViewer
                              oldValue={pastData}
                              newValue={newData}
                              splitView={true}
                              disableWordDiff={true}
                            />
                          )}
                        </div>
                      </div>

                      {request.status == RequestStatus.Pending && (
                        <DialogFooter>
                          <Button
                            variant="outline"
                            className="bg-blue-100 border border-blue-300"
                            onClick={() =>
                              updateRequest({
                                id: request.id,
                                selection: true,
                              })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-blue-100 border border-blue-300"
                            onClick={() =>
                              updateRequest({
                                id: request.id,
                                selection: false,
                              })
                            }
                          >
                            Reject
                          </Button>
                        </DialogFooter>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedRequest && (
          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent>
              <DialogHeader>
                <h2>Request Details</h2>
              </DialogHeader>
              <div>
                {/* Display details of the selected request */}
                <p>ID: {selectedRequest.id}</p>
                <p>Type: {selectedRequest.requestedBy}</p>
                <p>Type: {selectedRequest.type}</p>
                <p>Status: {selectedRequest.createdAt}</p>
                <p>Status: {selectedRequest.status}</p>
                {/* Add more details as needed */}
              </div>
              <DialogFooter>
                <Button onClick={() => setOpenModal(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
