import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { camelCaseToNormalText } from "@/lib/utils";
import { boolean } from "zod";
import { Button } from "./button";

type Props = {
  visibleColumns: { [key: string]: boolean };
  setVisibleColumns: any;
};

export function DropdownMenuCheckboxes({
  visibleColumns,
  setVisibleColumns,
}: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleCheckedChange = (columnKey: string) => {
    setVisibleColumns((prev: any) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger>
        <Button variant="outline" className="border-blue-200">
          Select Columns to Display
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className={`ml-2 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            viewBox="0 0 16 16"
          >
            <path d="M8 9l4-4H4l4 4z"></path>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 bg-blue-100 border-blue-200">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.keys(visibleColumns).map((columnKey) => (
          <DropdownMenuCheckboxItem
            key={columnKey}
            checked={visibleColumns[columnKey]}
            onCheckedChange={() => handleCheckedChange(columnKey)}
          >
            {camelCaseToNormalText(columnKey)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
