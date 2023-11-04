import { ChangeEvent, FC } from "react";
import { Input } from "../ui/input";
import { FormItem, FormLabel } from "../ui/form";

interface InputFileProps {
  id: string;
  name: string;
  onFileUpload: (data: any) => void;
}

const InputFile: FC<InputFileProps> = ({ id, name, onFileUpload }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      onFileUpload(file);
    } else {
      onFileUpload(null);
    }
  };

  return (
    <FormItem>
      <FormLabel>Prescription</FormLabel>
      <Input
        type="file"
        id={id}
        name={name}
        onChange={handleFileChange}
        accept=".pdf"
      />
    </FormItem>
  );
};

export default InputFile;
