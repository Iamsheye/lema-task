import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function NavigationButton({
  icon: Icon,
  iconPosition = "left",
  size = "md",
  className,
  children,
  ...props
}: NavigationButtonProps) {
  const baseClasses = cn(
    "flex items-center gap-2 rounded-lg font-semibold transition-colors cursor-pointer",
    "hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
    "text-text-secondary",
  );

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(baseClasses, sizeClasses[size], className)}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon className="h-5 w-5" strokeWidth={1.67} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="h-5 w-5" strokeWidth={1.67} />
      )}
    </button>
  );
}
