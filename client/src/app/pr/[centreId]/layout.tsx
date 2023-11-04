"use client";
import { Card } from "@/components/ui/card";
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
      path: `/pr/${params.centreId}/dashboard`, // Adjust the path for Dashboard
      icon: <LayoutDashboard />,
    },

    {
      title: "Expenses",
      path: `/pr/${params.centreId}/expenses`,
      icon: <Receipt />,
    },
  ];

  return (
    <div className="flex flex-col m-4 h-full rounded-md border bg-blue-50 border-blue-200 overflow-hidden">
      <nav className="flex items-center justify-between gap-4 p-6 border-b border-b-blue-200">
        <h1 className="text-xl  text-blue-950">PR Dashboard</h1>
        <Avatar>
          <AvatarImage
            className="w-[30px] rounded-xl"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </nav>

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
    </div>
  );
}