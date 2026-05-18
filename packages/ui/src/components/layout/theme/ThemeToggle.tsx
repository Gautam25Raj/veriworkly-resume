"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "../../ui/Button";

const emptySubscribe = () => () => {};

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return <div className="bg-accent/5 h-10 w-10 animate-pulse rounded-full" />;
  }

  return (
    <Button
      variant="secondary"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-accent/5 hover:bg-accent/10 h-10 w-10 shrink-0 rounded-full border-transparent transition-all active:scale-95"
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
};
