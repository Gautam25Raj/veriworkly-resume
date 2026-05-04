import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Container<T extends React.ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
