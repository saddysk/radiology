"use client";

import { useCentreExpense, useEditRequest } from "@/lib/query-hooks";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  ExpenseDto,
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
    id: selectedRequest?.expenseData?.id!,
    centreId,
    enabled: selectedRequest?.expenseData?.id ? true : false,
  });

  let newCode = "";
  if (selectedRequest?.type === RequestType.Expense) {
    newCode = JSON.stringify(
      {
        amount: expense?.data.amount,
        expenseType: expense?.data.expenseType,
        paymentMethod: expense?.data.paymentMethod,
      },
      null,
      4
    );
  }

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
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Options</TableHead>
          </TableHeader>
          <TableBody>
            {dataEdit?.data.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>{request.status}</TableCell>
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
                        <DialogTitle>View Changes</DialogTitle>
                        <DialogDescription>
                          You can view the changes here
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <ReactDiffViewer
                          oldValue={JSON.stringify(
                            {
                              amount: request?.expenseData?.amount,
                              expenseType: request?.expenseData?.expenseType,
                              paymentMethod:
                                request?.expenseData?.paymentMethod,
                            },
                            null,
                            4
                          )}
                          newValue={newCode}
                          splitView={true}
                          disableWordDiff={true}
                        />
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
                <p>Type: {selectedRequest.type}</p>
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
