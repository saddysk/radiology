import { CentreDto } from "@/app/api/data-contracts";
import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import CentreCreateUpdateForm from "./form";

interface UpdateCentreDialogProps {
  centre: CentreDto;
}

const UpdateCentreDialog: FC<UpdateCentreDialogProps> = ({ centre }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-blue-100 p-8">
        <DialogHeader>
          <DialogTitle>Edit centre</DialogTitle>
          <DialogDescription>
            Update your centre details here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <CentreCreateUpdateForm centreDetails={centre} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCentreDialog;
