"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="text-foreground space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </label>
  );
}

export function TextArea({
  className,
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "border-border bg-background text-foreground focus:border-accent/40 focus:ring-accent/20 min-h-24 w-full rounded-3xl border px-4 py-3 text-sm shadow-sm transition outline-none focus:ring-2",
        className,
      )}
      value={value}
      {...props}
    />
  );
}

export function invalidClass(error?: string) {
  return error
    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
    : undefined;
}

function parseDelimited(value: string) {
  return value
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function DelimitedTextArea({
  className,
  onChange,
  value,
}: {
  className?: string;
  onChange: (nextValue: string[]) => void;
  value: string[];
}) {
  const [draftValue, setDraftValue] = useState(value.join(", "));

  return (
    <TextArea
      value={draftValue}
      className={className}
      onChange={(event) => {
        const nextDraftValue = event.target.value;
        setDraftValue(nextDraftValue);
        onChange(parseDelimited(nextDraftValue));
      }}
    />
  );
}
