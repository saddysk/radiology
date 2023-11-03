"use client";

import { AddBookingsComponent } from "@/components/bookings/create";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function AddBookings({ centreId }: { centreId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <div className="flex flex-col items-center w-full h-[85vh] p-8 overflow-y-scroll">
      <h1 className="text-4xl text-center opacity-90 items-center space-x-4 mb-6">
        <span>Add Bookings</span>
      </h1>
      <AddBookingsComponent
        centreId={centreId}
        onSuccess={() => {
          toast({
            title: `Booking successful`,
            variant: "default",
          });
          router.push(`/admin/centre/${centreId}/bookings`);
        }}
      />
    </div>
  );
}
