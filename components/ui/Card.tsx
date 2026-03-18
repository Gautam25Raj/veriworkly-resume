import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function Card({
  className,
  as: Component = "div",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "border-border bg-card rounded-3xl border p-6 shadow-[0_18px_60px_-32px_rgba(15,23,42,0.35)]",
        className,
      )}
      {...props}
    />
  );
}
