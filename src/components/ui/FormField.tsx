import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      <label htmlFor={htmlFor} className="text-lg font-medium text-[#535862]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
  const baseClassName =
    "flex items-center rounded border bg-white px-4 py-[10px] text-sm leading-[1.5] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none";
  const errorClassName = error ? "border-red-500" : "border-[#E2E8F0]";

  return (
    <input
      className={`${baseClassName} ${errorClassName} ${className}`}
      {...props}
    />
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
  const baseClassName =
    "flex resize-none rounded border bg-white px-4 py-[10px] text-sm leading-[1.5] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none";
  const errorClassName = error ? "border-red-500" : "border-[#E2E8F0]";

  return (
    <textarea
      className={`${baseClassName} ${errorClassName} ${className}`}
      {...props}
    />
  );
}
