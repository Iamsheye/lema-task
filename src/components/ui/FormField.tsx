import { forwardRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-text-secondary text-lg font-medium"
      >
        {label}
      </label>
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    const baseClassName =
      "flex items-center rounded border bg-white px-4 py-2.5 text-sm leading-normal placeholder:text-text-placeholder focus:ring-2 focus:ring-slate-950 focus:outline-none";
    const errorClassName = error ? "border-red-500" : "border-border-light";

    return (
      <input
        ref={ref}
        className={cn(baseClassName, errorClassName, className)}
        {...props}
      />
    );
  },
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => {
    const baseClassName =
      "flex resize-none rounded border bg-white px-4 py-2.5 text-sm leading-normal placeholder:text-text-placeholder focus:ring-2 focus:ring-slate-950 focus:outline-none h-[180px]";
    const errorClassName = error ? "border-red-500" : "border-border-light";

    return (
      <textarea
        ref={ref}
        className={cn(baseClassName, errorClassName, className)}
        {...props}
      />
    );
  },
);
