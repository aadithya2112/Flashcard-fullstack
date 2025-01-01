import { FC } from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  register: any;
  error: FieldError | undefined;
}

const InputField: FC<InputFieldProps> = ({ label, type, id, register, error }) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id)}
        className={`w-full p-2 mt-1 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${
          error ? "border-red-500" : "border-gray-600"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;