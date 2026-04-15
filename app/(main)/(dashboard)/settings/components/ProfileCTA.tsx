import Link from "next/link";
import { UserCircle, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/Card";

export default function ProfileCTA() {
  return (
    <section>
      <Link href="/profile" className="group block">
        <Card className="group-hover:border-accent/40 group-hover:shadow-accent/5 relative overflow-hidden p-8 transition-all duration-500 group-hover:shadow-2xl">
          <div className="absolute top-0 right-0 translate-x-4 transform p-6 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
            <ArrowUpRight className="text-accent h-6 w-6" />
          </div>

          <div className="flex items-center gap-8">
            <div className="bg-accent/10 text-accent ring-accent/20 group-hover:bg-accent flex h-16 w-16 items-center justify-center rounded-2xl ring-1 transition-all duration-500 group-hover:scale-110 group-hover:text-white">
              <UserCircle className="h-9 w-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-foreground text-xl font-bold">
                Master Profile
              </h3>

              <p className="text-muted-foreground text-sm">
                Centralized data used for auto-filling resume drafts.
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </section>
  );
}
