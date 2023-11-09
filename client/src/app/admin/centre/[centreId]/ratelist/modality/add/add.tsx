"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useState } from "react";
import { ratelist } from "@/app/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetRateList } from "@/lib/query-hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RateList = {
  modality: string;
  investigation: Array<Investigations>;
};

type Investigations = {
  type: string;
  amount: number;
  filmCount: number;
  isSelected?: boolean;
};

export function AddRateList({ centreId }: { centreId: string }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [investigationUpdates, setInvestigationUpdates] = useState({
    type: "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const updateRateList = async ({ e }: { e: any }) => {
    e.preventDefault();
    try {
      if (investigationUpdates.type == "") {
        throw new Error("Empty modality input found");
      }

      setLoading(true);

      const response = await ratelist.rateListControllerCreate({
        centreId: centreId,
        rateLists: [{ modality: investigationUpdates.type, investigation: [] }],
      });

      if (response?.status !== 200) {
        throw new Error(response?.statusText);
      } else {
        queryClient.invalidateQueries(["ratelist", centreId]);
        toast({
          title: "Modality Added",
          variant: "default",
        });
        router.push(`/admin/centre/${centreId}/ratelist`);
        setInvestigationUpdates({
          type: "",
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
    <div className="flex flex-col items-center w-full h-[85vh] p-8 overflow-y-scroll">
      <h1 className="text-3xl text-center opacity-90 items-center space-x-4 mb-6">
        <span>Add Modality</span>
      </h1>

      <div className="space-y-8  px-4 w-full mt-6">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name">Name</label>
            <Select
              value={investigationUpdates.type}
              onValueChange={(e) => setInvestigationUpdates({ type: e })}
            >
              <SelectTrigger className="w-[400px] border border-blue-200 bg-blue-100">
                <SelectValue placeholder="Select a name for modality" />
              </SelectTrigger>
              <SelectContent className="w-full border border-blue-200 bg-blue-100">
                <SelectGroup>
                  <SelectItem value="X-RAY">X-Ray</SelectItem>
                  <SelectItem value="USG">USG</SelectItem>
                  <SelectItem value="CT-SCAN">CT-SCAN</SelectItem>
                  <SelectItem value="MRI">MRI</SelectItem>
                  <SelectItem value="2D-ECHO">2D-Echo</SelectItem>
                  <SelectItem value="SPECIAL-INVESTIGATIONS">
                    Special Investigations
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="button"
          loading={loading}
          onClick={(e) => {
            updateRateList({
              e,
            });
          }}
          className="bg-white border border-blue-200"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
