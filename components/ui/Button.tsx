import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-accent text-accent-foreground shadow-sm hover:opacity-90 cursor-pointer",
  secondary:
    "bg-card text-foreground ring-1 ring-inset ring-border hover:bg-background",
  ghost: "bg-transparent text-foreground hover:bg-card",
} as const;

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;

  /** Render as different element (e.g. Link) */
  asChild?: boolean;

  /** Loading state */
  loading?: boolean;
}

export function Button({
  className,
  size = "md",
  variant = "primary",
  type = "button",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp: any = asChild ? "span" : "button";

  const isDisabled = disabled || loading;

  return (
    <Comp
      className={buttonClassName(variant, size, className)}
      type={!asChild ? type : undefined}
      disabled={!asChild ? isDisabled : undefined}
      aria-disabled={isDisabled}
      data-disabled={isDisabled ? "" : undefined}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Comp>
  );
}
