import { CentreDto } from "@/app/api/data-contracts";
import { FC, useState } from "react";
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
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
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

        <CentreCreateUpdateForm
          centreDetails={centre}
          onUpdated={setOpenEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCentreDialog;
