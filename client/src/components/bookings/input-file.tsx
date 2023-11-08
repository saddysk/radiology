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
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result;

        if (base64Url && typeof base64Url === "string") {
          const base64 = base64Url.split(",")[1];
          onFileUpload(base64);
        }
      };
      reader.readAsDataURL(file);
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
