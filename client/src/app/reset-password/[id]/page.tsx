import { Card } from "@/components/ui/card";
import ResetPasswordForm from "../form";

export default async function ResetPasswordPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Card className="flex flex-col items-center justify-center py-28 space-y-6 m-4 h-full rounded-md bg-zinc-950 border-zinc-600">
      <h1 className="text-xl text-center sm:text-2xl opacity-90 flex items-center space-x-4">
        <span>Reset Password</span>
      </h1>
      <ResetPasswordForm userId={params.id} />
    </Card>
  );
}
