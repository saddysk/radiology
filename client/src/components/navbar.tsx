import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NabvbarProps {}

const Nabvbar: FC<NabvbarProps> = () => {
  return (
    <nav className="flex items-center justify-between gap-4 p-6 border-b border-b-blue-200">
      <h1 className="text-xl">Dashboard</h1>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </nav>
  );
};

export default Nabvbar;
