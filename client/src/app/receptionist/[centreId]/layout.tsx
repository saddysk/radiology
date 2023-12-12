"use client";
import Nabvbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserData } from "@/lib/query-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import clsx from "clsx";
import {
  ClipboardList,
  Contact2,
  Edit,
  LayoutDashboard,
  ListTodo,
  Receipt,
  Stethoscope,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReceptionistLayout({
  children,
  params, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: any;
}) {
  const pathname = usePathname();
  const route = useRouter();

  const tabs = [
    {
      title: "Dashboard",
      path: `/receptionist/${params.centreId}/dashboard`, // Adjust the path for Dashboard
      icon: <LayoutDashboard size={20} />,
    },

    {
      title: "Bookings",
      path: `/receptionist/${params.centreId}/bookings`,
      icon: <ClipboardList size={20} />,
    },
    // {
    //   title: "Patients",
    //   path: `/receptionist/${params.centreId}/patients`,
    //   icon: <Contact2 size={20} />,
    // },
    // {
    //   title: "Expenses",
    //   path: `/receptionist/${params.centreId}/expenses`,
    //   icon: <Receipt />,
    // },
  ];

  const { data: user } = useUserData();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.data?.role !== "pr" && user !== undefined) {
      toast({
        title: `You are not authorized to view this page`,
        variant: "destructive",
      });
      route.push("/");
    }
  }, [user]);

  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-blue-50 border-blue-200">
      <Nabvbar />

      <div className="flex h-full">
        <div className="border-r border-r-blue-200 flex flex-col gap-2 py-6">
          <p
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer border border-blue-200 rounded-md m-6 nowrap whitespace-nowrap"
            onClick={() =>
              route.push(`/receptionist/${params.centreId}/bookings/add`)
            }
          >
            Add Booking {"  "} +
          </p>

          {tabs.map((tab, index) => {
            return (
              <div
                key={index}
                className={clsx(
                  "px-6 py-2 hover:bg-blue-100 text-blue-950 cursor-pointer flex gap-2",
                  pathname == tab.path && "bg-blue-200"
                )}
                onClick={() => route.push(tab.path)}
              >
                {tab.icon}
                <p className="whitespace-nowrap">{tab.title}</p>
              </div>
            );
          })}
        </div>
        {children}
      </div>
    </Card>
  );
}
