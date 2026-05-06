"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "../../utils";

/**
 * Returns the base classes for the checkbox visual element.
 * Useful for external styling or consistent design across components.
 */
export function checkboxClassName(className?: string) {
  return cn(
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-border bg-background transition-all duration-200 ease-in-out select-none",
    "hover:border-accent/60 hover:bg-accent/5",
    "peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-focus-visible:ring-offset-2",
    "peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground",
    "peer-indeterminate:border-accent peer-indeterminate:bg-accent peer-indeterminate:text-accent-foreground",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:grayscale-[0.5]",
    "active:scale-95",
    className,
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onCheckedChange, indeterminate, id, className, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const internalRef = React.useRef<HTMLInputElement>(null);

    // Merge refs to allow external access while using it internally
    React.useImperativeHandle(ref, () => internalRef.current!);

    // Sync indeterminate property with the native input element
    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <label
        className={cn(
          "group flex items-center gap-3 w-fit transition-opacity",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={internalRef}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="peer sr-only"
            {...props}
          />

          <div className={checkboxClassName()}>
            {indeterminate ? (
              <Minus
                className="h-3.5 w-3.5 transition-all duration-200 scale-100 opacity-100"
                strokeWidth={4}
              />
            ) : (
              <Check
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-200",
                  checked ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-12",
                )}
                strokeWidth={4}
              />
            )}
          </div>
        </div>

        {label && (
          <span
            className={cn(
              "text-sm font-medium leading-none select-none text-muted-foreground transition-colors duration-200",
              "group-hover:text-foreground/80",
              (checked || indeterminate) && "text-foreground",
              disabled && "opacity-50",
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
