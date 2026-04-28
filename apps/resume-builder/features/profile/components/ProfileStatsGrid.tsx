"use client";

import {
  Mail,
  Link2,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
} from "lucide-react";

import { Card } from "@veriworkly/ui";
import { Badge } from "@veriworkly/ui";

import NameEditor from "./NameEditor";

import { useUserStore } from "@/store/useUserStore";

import { cn } from "@/lib/utils";

const ProfileStatsGrid = () => {
  const { user, loading } = useUserStore();

  const stats = [
    {
      label: "Email Address",
      value: user?.email || "Not set",
      icon: Mail,
      status: user?.emailVerified ? "success" : "warning",
      statusLabel: user?.emailVerified ? "Verified" : "Action Required",
    },
    {
      label: "Cloud Sync",
      value: user?.autoSyncEnabled ? "Active" : "Paused",
      icon: RefreshCw,
      status: user?.autoSyncEnabled ? "success" : "neutral",
    },
    {
      label: "Shared Assets",
      value: `${user?.shareResumeCount ?? 0} Links`,
      icon: Link2,
    },
    {
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric",
          })
        : "N/A",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NameEditor />

      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="group hover:border-accent/40 relative flex flex-col justify-between overflow-hidden p-0 transition-all"
          >
            <div className="absolute -top-4 -right-4 opacity-[0.03] transition-opacity group-hover:opacity-[0.06]">
              <Icon size={120} />
            </div>

            <div className="flex flex-col space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className="bg-accent/10 text-accent flex h-8 w-8 items-center justify-center rounded-lg">
                  <Icon size={18} />
                </div>

                {stat.status && (
                  <Badge
                    className={cn(
                      "flex items-center px-2 text-[10px] font-bold tracking-wider uppercase",
                      stat.status === "success" &&
                        "bg-emerald-500/10 text-emerald-600",
                    )}
                  >
                    {stat.status === "success" ? (
                      <ShieldCheck size={10} className="mr-1" />
                    ) : (
                      <ShieldAlert size={10} className="mr-1" />
                    )}
                    {stat.statusLabel || stat.value}
                  </Badge>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground/80 text-[10px] font-bold tracking-widest uppercase">
                  {stat.label}
                </span>

                <p className="text-foreground truncate text-lg font-bold tracking-tight">
                  {loading ? (
                    <span className="bg-muted inline-block h-5 w-24 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileStatsGrid;
