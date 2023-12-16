"use client";
import CenteredSpinner from "@/components/ui/centered-spinner";
import { useAllUsers, useUserData } from "@/lib/query-hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: user } = useUserData();
  const router = useRouter();

  useEffect(() => {
    switch (user?.data.role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "receptionist":
        router.push("/receptionist/dashboard");
        break;
      case "pr":
        router.push("/pr/dashboard");
        break;
      case "doctor":
        router.push("/doctor/dashboard");
        break;

      case undefined:
        router.push("/login");
        break;
      default:
        break;
    }
  }, [user, router]);

  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <CenteredSpinner />
    </div>
  );
}
