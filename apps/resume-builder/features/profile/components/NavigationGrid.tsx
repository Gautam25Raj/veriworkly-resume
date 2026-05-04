import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

const ROUTES = [
  {
    href: "/profile",
    title: "Overview",
    desc: "Account status and primary identity settings.",
  },
  {
    href: "/profile/master",
    title: "Master Editor",
    desc: "Guided form experience for your global resume data.",
  },
  {
    href: "/profile/advanced",
    title: "Advanced",
    desc: "Bulk JSON controls, imports, and data backups.",
  },
] as const;

const NavigationGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {ROUTES.map((route) => (
        <Card
          key={route.href}
          className="group hover:border-accent/40 hover:shadow-accent/5 p-6 transition-all hover:shadow-lg"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-foreground text-xl font-bold tracking-tight">
                {route.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {route.desc}
              </p>
            </div>

            <Button
              asChild
              variant="secondary"
              className="group-hover:bg-accent w-full transition-colors group-hover:text-white"
            >
              <Link
                href={route.href}
                className="flex items-center justify-between"
              >
                Explore Page <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NavigationGrid;
