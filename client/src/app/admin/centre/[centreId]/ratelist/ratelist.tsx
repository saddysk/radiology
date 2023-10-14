"use client";
import { z } from "zod";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { ratelist } from "./data"; // Import your ratelist array
import { Input } from "@/components/ui/input";
let renderCount = 0;
const rateListItemSchema = z.object({
  type: z.string(),
  rate: z.number(),
  filmCount: z.number().nullable(),
  isSelected: z.boolean(),
});
type Investigations = {
  type: string;
  rate: number;
  filmCount: number | null;
  isSelected?: boolean;
};
const rateListSchema = z.array(rateListItemSchema);

export function RateList() {
  renderCount++;
  return (
    <div className="w-full p-8 overflow-y-scroll">
      <p>{renderCount}</p>

      {ratelist.map((list, index) => (
        <RateListForm key={index} {...list} />
      ))}
    </div>
  );
}

const RateListForm = ({
  modality,
  investigations,
}: {
  modality: string;
  investigations: Investigations[];
}) => {
  const { register, handleSubmit, control, watch, formState, getValues } =
    useForm({
      defaultValues: {
        investigations: investigations.map((inv: Investigations) => ({
          ...inv,
          rate: inv.rate,
          filmCount: inv.filmCount ? inv.filmCount : null, // convert string to number
          isSelected: false,
        })),
      },
      resolver: zodResolver(rateListSchema),
    });
  console.log(formState, formState.errors, getValues());
  const { fields } = useFieldArray({
    control,

    name: "investigations",
  });

  const watchFieldArray = watch("investigations");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const onSubmit = (data) => {
    console.log("data", data);
    const updatedInvestigations = data.investigations.filter(
      (inv: Investigations) => inv.isSelected
    );
    console.log("Updated Investigations:", updatedInvestigations);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{modality} Rate List</h1>
      <table className="w-full">
        <thead>{/* ... */}</thead>
        <tbody>
          {controlledFields.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item?.type}</td>
              <td className="text-right">
                <Input
                  type="number"
                  disabled={!item?.isSelected}
                  {...register(`investigations.${index}.rate`, {
                    valueAsNumber: true,
                  })}
                />
              </td>
              <td className="text-right">
                <Input
                  type="number"
                  disabled={!item?.isSelected}
                  {...register(`investigations.${index}.filmCount`, {
                    valueAsNumber: true,
                  })}
                />
              </td>
              <td className="text-center">
                <Input
                  type="checkbox"
                  {...register(`investigations.${index}.isSelected`)}
                />
                <Error
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">Submit</button>
    </form>
  );
};
