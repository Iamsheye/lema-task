import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export function Loading({ className = "" }: LoadingProps) {
  return (
    <div className={cn("relative inline-block h-20 w-20", className)}>
      <div className="animate-ellipsis1 absolute top-[33.33px] left-2 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]" />
      <div className="animate-ellipsis2 absolute top-[33.33px] left-2 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]" />
      <div className="animate-ellipsis2 absolute top-[33.33px] left-8 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]" />
      <div className="animate-ellipsis3 absolute top-[33.33px] left-14 h-[13.33px] w-[13.33px] rounded-full bg-[#B0B0BF]" />
    </div>
  );
}
