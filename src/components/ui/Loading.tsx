import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "default" | "sm";
  className?: {
    base?: string;
    circle?: string;
  };
}

export function Loading({ className = {}, size = "default" }: LoadingProps) {
  return (
    <div
      className={cn(
        "relative inline-block h-20 w-20",
        size === "sm" && "h-10 w-10",
        className.base,
      )}
      data-testid="loading"
    >
      <div
        className={cn(
          "animate-ellipsis1 absolute top-[33.33px] left-2 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]",
          size === "sm" && "top-4 left-1 h-1.5 w-1.5",
          className.circle,
        )}
      />
      <div
        className={cn(
          "animate-ellipsis2 absolute top-[33.33px] left-2 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]",
          size === "sm" && "top-4 left-1 h-1.5 w-1.5",
          className.circle,
        )}
      />
      <div
        className={cn(
          "animate-ellipsis2 absolute top-[33.33px] left-8 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]",
          size === "sm" && "top-4 left-4 h-1.5 w-1.5",
          className.circle,
        )}
      />
      <div
        className={cn(
          "animate-ellipsis3 absolute top-[33.33px] left-14 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]",
          size === "sm" && "top-4 left-7 h-1.5 w-1.5",
          className.circle,
        )}
      />
    </div>
  );
}
