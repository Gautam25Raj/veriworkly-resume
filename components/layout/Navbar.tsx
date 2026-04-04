import Link from "next/link";

import { siteConfig } from "@/config/site";

import { buttonClassName } from "@/components/ui/Button";

import { Container } from "@/components/layout/Container";

import NavLinks from "../dashboard/NavLinks";
import { ThemeToggle } from "../dashboard/ThemeToggle";

const Navbar = () => {
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

          {/* <Link
            href="/login"
            title="Admin login"
            className={buttonClassName("ghost", "sm")}
          >
            Admin
          </Link> */}

          <Link href="/dashboard" className={buttonClassName("primary", "sm")}>
            Dashboard
          </Link>
        </div>
      </Container>

      <div className="border-border/20 flex justify-center border-t py-2 md:hidden">
        <NavLinks />
      </div>
    </header>
  );
};

export default Navbar;
