"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import CentreCreateUpdateForm from "@/components/centre/form";

export function AdminOnboarding() {
  const router = useRouter();

  const [selectedFlow, setSelectedFlow] = useState<"create" | null>(null);

  return (
    <Card className="m-4 h-full rounded-md bg-blue-50 border-blue-200">
      {selectedFlow != null && (
        <button onClick={() => setSelectedFlow(null)} className="ml-4 mt-4">
          <ArrowLeftIcon />
        </button>
      )}

      <div className="h-full flex flex-col items-center justify-center space-y-6">
        {selectedFlow == null && (
          <div className="flex gap-8">
            <Card
              className="flex flex-col items-center justify-center rounded-md p-10 bg-blue-50 border-blue-200"
              onClick={() => setSelectedFlow("create")}
            >
              <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
                Create Center
              </h1>
            </Card>
            <Card
              className="flex flex-col items-center justify-center rounded-md p-10 bg-blue-50 border-blue-200"
              onClick={() => router.push("/admin/centre/join")}
            >
              <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
                Join Center
              </h1>
            </Card>
          </div>
        )}

        {selectedFlow == "create" && (
          <div className="flex flex-col items-center justify-center py-28 space-y-6 h-full rounded-md bg-blue-50 border-blue-200 w-[100%] overflow-y-auto">
            <h1 className="text-4xl text-center opacity-90 items-center space-x-4 mb-6">
              <span>Create Center</span>
            </h1>
            <CentreCreateUpdateForm />
          </div>
        )}
      </div>
    </Card>
  );
}
