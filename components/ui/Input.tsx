import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-background ring-offset-background flex h-11 w-full rounded-2xl border px-4 py-2 text-sm transition-all duration-200",
          "placeholder:text-muted-foreground/50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:ring-accent/20 focus-visible:border-accent/40 outline-none focus-visible:ring-2",
          "disabled:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-red-500/10"
            : "border-border",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
