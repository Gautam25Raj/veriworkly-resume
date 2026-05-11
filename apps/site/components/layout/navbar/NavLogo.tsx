import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/config/site";

export const NavLogo = () => {
  return (
    <Link href="/" className="group flex items-center gap-3 transition-all active:scale-95">
      <div className="relative h-10 w-10 shrink-0">
        <Image
          priority
          width={40}
          height={40}
          alt="VeriWorkly Logo"
          src="/veriworkly-logo.png"
          className="h-full w-full object-contain"
        />
      </div>

      <span className="font-mono text-2xl font-semibold tracking-tight">
        {siteConfig.shortName}
      </span>
    </Link>
  );
};
