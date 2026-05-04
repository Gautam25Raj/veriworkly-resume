import Link from "next/link";

import { cn } from "@/lib/utils";

import { siteConfig } from "@/config/site";

const NavLinks = ({ className }: { className?: string }) => {
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {siteConfig.navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-muted hover:text-foreground hover:bg-card rounded-full px-4 py-2 text-sm font-medium transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
