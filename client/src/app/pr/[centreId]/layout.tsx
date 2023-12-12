"use client";
import Nabvbar from "@/components/navbar";
import { useToast } from "@/components/ui/use-toast";
import { useUserData } from "@/lib/query-hooks";
import clsx from "clsx";
import {
  BarChartHorizontalBig,
  LayoutDashboard,
  LayoutList,
  Receipt,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrLayout({
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
      title: "Centres",
      path: `/pr/dashboard`,
      icon: <LayoutList size={20} />,
    },
    {
      title: "Dashboard",
      path: `/pr/${params.centreId}/dashboard`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Expenses",
      path: `/pr/${params.centreId}/expenses`,
      icon: <Receipt size={20} />,
    },
    {
      title: "Doctor Analytics",
      path: `/pr/${params.centreId}/analytics`,
      icon: <BarChartHorizontalBig size={20} />,
    },
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
    <div className="flex flex-col m-4 h-full rounded-md border bg-blue-50 border-blue-200 overflow-hidden">
      <Nabvbar />

      <div className="flex h-full">
        <div className="border-r border-r-blue-200 flex flex-col gap-2 py-6">
          <p
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer border border-blue-200 rounded-md m-6 nowrap whitespace-nowrap"
            onClick={() => route.push(`/pr/${params.centreId}/bookings/add`)}
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
    </div>
  );
}
