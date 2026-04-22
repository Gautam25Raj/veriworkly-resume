"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonClassName } from "@/components/ui/Button";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className={cn(buttonClassName("ghost"), className)}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </button>
  );
};

export { ThemeToggle };
