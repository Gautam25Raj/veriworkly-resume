"use client";

import * as React from "react";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { Container, cn } from "@veriworkly/ui";

import { NavLogo } from "./navbar/NavLogo";
import { MobileNav } from "./navbar/MobileNav";
import { NavActions } from "./navbar/NavActions";
import { DesktopNav } from "./navbar/DesktopNav";

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close mobile nav on route change during render to avoid cascading effects
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);

    if (isOpen) setIsOpen(false);
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 right-0 left-0 z-100 transition-all duration-300",
          scrolled || isOpen
            ? "border-border/40 bg-background/95 border-b py-3 backdrop-blur-xl"
            : "bg-transparent py-5",
        )}
      >
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-10">
              <NavLogo />
              <DesktopNav />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <NavActions />

              <button
                aria-label="Toggle menu"
                onClick={() => setIsOpen(!isOpen)}
                className="text-muted hover:text-foreground bg-accent/5 relative z-110 flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-90 lg:hidden"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Navbar;
