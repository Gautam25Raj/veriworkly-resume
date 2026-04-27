"use client";

import {
  LogOut,
  Loader2,
  Settings,
  UserRound,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";

import { Container } from "@veriworkly/ui";
import { Menu, MenuItem } from "@veriworkly/ui";
import { Button, buttonClassName } from "@veriworkly/ui";

import { signOutCurrentUser } from "@/features/auth/services/current-user";

import NavLinks from "../dashboard/NavLinks";
import { ThemeToggle } from "../dashboard/ThemeToggle";

import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
  const router = useRouter();

  const { user, isLoggedIn, loading, logout } = useUserStore();

  const initials = (user?.name || user?.email || "U")
    .trim()
    .slice(0, 1)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      await signOutCurrentUser();

      logout();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="border-border/40 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground text-sm font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
          >
            {siteConfig.shortName}
          </Link>

          <NavLinks className="hidden md:flex" />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {loading ? (
            <Button
              size="sm"
              variant="ghost"
              disabled
              aria-label="Loading user session"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : isLoggedIn ? (
            <Menu
              panelClassName="min-w-48"
              trigger={({ open, toggle, menuId }) => (
                <Button
                  size="sm"
                  variant="secondary"
                  aria-label="Open profile menu"
                  aria-expanded={open}
                  aria-haspopup="menu"
                  aria-controls={open ? menuId : undefined}
                  onClick={toggle}
                  className="gap-2"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700/20 bg-zinc-500/10 text-xs font-semibold">
                    {initials}
                  </span>
                  <span className="hidden sm:inline">
                    {user?.name || "Account"}
                  </span>
                </Button>
              )}
            >
              {({ close }) => (
                <>
                  <MenuItem
                    onClick={() => {
                      close();
                      router.push("/dashboard");
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      close();
                      router.push("/profile");
                    }}
                  >
                    <UserRound className="h-4 w-4" />
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      close();
                      router.push("/settings");
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </MenuItem>

                  <div className="border-border/40 my-1 border-t" />

                  <MenuItem
                    className="text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/30"
                    onClick={async () => {
                      close();
                      await handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </MenuItem>
                </>
              )}
            </Menu>
          ) : (
            <Link href="/login" className={buttonClassName("primary", "sm")}>
              Login
            </Link>
          )}
        </div>
      </Container>

      <div className="border-border/20 flex justify-center border-t py-2 md:hidden">
        <NavLinks />
      </div>
    </header>
  );
};

export default Navbar;
