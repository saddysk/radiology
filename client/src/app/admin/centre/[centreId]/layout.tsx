"use client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

export default function CentreLayout({
  children,
  params, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: any;
}) {
  const pathname = usePathname();
  const route = useRouter();
  console.log(pathname, "wefrg");
  const tabs = [
    {
      title: "Dashboard",
      path: `/admin/centre/${params.centreId}`, // Adjust the path for Dashboard
      icon: "",
    },
    {
      title: "Ratelist",
      path: `/admin/centre/${params.centreId}/ratelist`,
    },
    {
      title: "Affiliated Doctors",
      path: `/admin/centre/${params.centreId}/products`,
      icon: "",
    },
    {
      title: "Receptionists",
      path: `/admin/centre/${params.centreId}/orders`,
      icon: "",
    },
    {
      title: "Bookings",
      path: `/admin/centre/${params.centreId}/settings`,
      icon: "",
    },
  ];

  return (
    <Card className="flex flex-col m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      <nav className="flex items-center justify-between gap-4 p-6 border-b border-b-zinc-600">
        <h1 className="text-xl text-white">Admin Dashboard</h1>
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
        <div className="border-r border-r-zinc-600 flex flex-col gap-2 py-6">
          {tabs.map((tab, index) => {
            return (
              <div
                className={clsx(
                  "px-6 py-2 hover:bg-zinc-900 cursor-pointer",
                  pathname == tab.path && "bg-zinc-700"
                )}
                onClick={() => route.push(tab.path)}
              >
                {tab.title}
              </div>
            );
          })}
        </div>
        {children}
      </div>
    </Card>
  );
}
