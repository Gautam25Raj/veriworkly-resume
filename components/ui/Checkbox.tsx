"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function checkboxClassName(className?: string) {
  return cn(
    "group relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-border bg-background transition-all duration-200 ease-in-out",
    "hover:border-accent/50",
    "peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none",
    "peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:grayscale-[0.5]",
    className,
  );
}

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onCheckedChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="peer border-input bg-background checked:border-accent checked:bg-accent focus-visible:ring-accent/40 h-4 w-4 cursor-pointer appearance-none rounded border transition-all outline-none focus-visible:ring-2 disabled:opacity-50"
            {...props}
          />

          <Check
            className="text-accent-foreground pointer-events-none absolute h-3 w-3 opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={4}
          />
        </div>

        {label && (
          <label
            htmlFor={inputId}
            className="text-muted-foreground cursor-pointer text-xs leading-none font-medium select-none peer-disabled:opacity-50"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
