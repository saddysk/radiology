import * as React from "react";
import { LoginForm } from "./form";
import { Card } from "@/components/ui/card";

export default async function LoginPage() {
  return (
    <Card className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
        <span>Login</span>
      </h1>
      <LoginForm />
    </Card>
  );
}
