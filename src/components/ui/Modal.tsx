import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  maxWidth = "679px",
  className = "",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/50" />
        <Dialog.Content
          className={cn(
            `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-[0px_4px_8px_-3px_rgba(0,0,0,0.1),1px_10px_20px_-5px_rgba(0,0,0,0.08)]`,
            className,
          )}
          style={{ maxWidth }}
        >
          {showCloseButton && (
            <Dialog.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          )}

          {title && (
            <Dialog.Title className="mb-6 text-4xl leading-[1.21] font-medium tracking-[-0.02em] text-[#181D27]">
              {title}
            </Dialog.Title>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
