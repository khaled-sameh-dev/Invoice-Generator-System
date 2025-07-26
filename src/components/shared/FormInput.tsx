import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps {
  children: ReactNode;
  label: string;
  inputName: string;
}
function FormInput({ children, label, inputName }: FormInputProps) {
  const {
    formState: { errors },
  } = useFormContext();
  return (
    <div className="w-full flex flex-col gap-1 mb-6">
      <label htmlFor={inputName} className="font-medium text-slate-800/80 ml-1">
        {label}
      </label>
      <div>
        {children}
        {errors[inputName]?.message && (
          <p className="text-red-500 ml-4">
            {String(errors[inputName].message)}
          </p>
        )}
      </div>
    </div>
  );
}

export default FormInput;
