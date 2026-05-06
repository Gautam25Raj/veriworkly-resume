"use client";

import * as React from "react";

import { cn } from "../../utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ModalRoot({ open, onClose, children }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

function ModalContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "border-border bg-card w-full rounded-t-3xl border p-6 shadow-2xl",
        "animate-in slide-in-from-bottom duration-300",
        "md:zoom-in-95 md:max-w-lg md:rounded-3xl",
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex justify-center md:hidden">
        <div className="bg-muted h-1.5 w-12 rounded-full" />
      </div>

      {children}
    </div>
  );
}

function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2 space-y-1", className)} {...props} />;
}

function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-foreground text-base font-semibold", className)} {...props} />;
}

function ModalDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-muted text-sm", className)} {...props} />;
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-[60vh] overflow-y-auto py-2", className)} {...props} />;
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t px-4 py-3 sm:flex-row sm:justify-end md:bg-zinc-500/5",
        className,
      )}
      {...props}
    />
  );
}

export const Modal = Object.assign(ModalRoot, {
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
});
