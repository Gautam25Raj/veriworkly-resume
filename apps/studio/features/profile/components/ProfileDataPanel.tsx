"use client";

import type { LucideIcon } from "lucide-react";

import * as React from "react";
import { Mail, RefreshCw, UserRound, CheckCircle2, CalendarClock, Pencil } from "lucide-react";

import type { AccountProfile } from "@/features/profile/services/account-profile";

import EditProfileNameModal from "./EditProfileNameModal";

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function DataLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-muted/10 min-w-0 rounded-xl p-3">
      <p className="text-muted flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
}

export default function ProfileDataPanel({ profile }: { profile: AccountProfile | null }) {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const email = profile?.email || "No email saved";
  const name = profile?.name || profile?.email?.split("@")[0] || "Local builder";

  const initials = name.slice(0, 1).toUpperCase();

  return (
    <>
      <section
        className="border-border bg-card overflow-hidden rounded-2xl border"
        aria-labelledby="profile-data-title"
      >
        <div className="border-border/70 grid gap-5 border-b p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <span className="bg-accent text-accent-foreground flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black">
            {initials}
          </span>

          <div className="min-w-0">
            <p className="text-muted text-xs font-bold tracking-[0.18em] uppercase">User profile</p>

            <h2
              id="profile-data-title"
              className="mt-1 flex items-center gap-2 truncate text-2xl font-black"
            >
              {name}
              <button
                aria-label="Edit name"
                id="edit-profile-name-header-btn"
                onClick={() => setIsEditModalOpen(true)}
                className="text-muted hover:text-accent hover:bg-muted/20 cursor-pointer rounded-lg p-1 transition"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </h2>

            <p className="text-muted mt-1 truncate text-sm">{email}</p>
          </div>

          <div className="bg-background/70 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            {profile?.emailVerified ? "Verified email" : "Email pending"}
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
          <div
            tabIndex={0}
            role="button"
            aria-label="Edit display name"
            id="edit-profile-name-card-trigger"
            onClick={() => setIsEditModalOpen(true)}
            className="border-accent/20 bg-accent/3 hover:border-accent/40 hover:bg-accent/8 group min-w-0 cursor-pointer rounded-xl border p-3 shadow-sm transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsEditModalOpen(true);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-muted flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase">
                <UserRound className="h-3.5 w-3.5" />
                Name
              </p>

              <span className="text-accent group-hover:text-accent/80 flex items-center gap-1 text-xs font-bold transition-colors">
                Edit <Pencil className="h-3 w-3" />
              </span>
            </div>

            <p className="text-foreground group-hover:text-accent mt-1 truncate text-sm font-bold transition-colors">
              {name}
            </p>
          </div>

          <DataLine icon={Mail} label="Email" value={email} />
          <DataLine
            icon={RefreshCw}
            label="Auto sync"
            value={profile?.autoSyncEnabled ? "On" : "Off"}
          />
          <DataLine icon={CalendarClock} label="Created" value={formatDate(profile?.createdAt)} />
          <DataLine icon={CalendarClock} label="Updated" value={formatDate(profile?.updatedAt)} />
        </div>
      </section>

      <EditProfileNameModal
        currentName={name}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
