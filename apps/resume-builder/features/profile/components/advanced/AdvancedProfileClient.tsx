"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Database, FileJson, ArrowLeft, ShieldAlert } from "lucide-react";

import type { MasterProfile } from "@/types/resume";

import { Card } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

import {
  saveMasterProfileToDatabase,
  loadMasterProfileFromDatabase,
  saveMasterProfileToLocalStorage,
  loadMasterProfileFromLocalStorage,
} from "@/features/resume/services/master-profile";

import ProfileAdvanced from "./ProfileAdvanced";

const AdvancedProfileClient = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [profile, setProfile] = useState<MasterProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const bundle = await loadMasterProfileFromDatabase();

        if (!mounted) return;

        if (bundle?.profile) {
          setProfile(bundle.profile);
          setUpdatedAt(bundle.updatedAt);
        } else {
          setProfile(loadMasterProfileFromLocalStorage().profile);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (nextProfile: MasterProfile) => {
    setSaving(true);
    try {
      const savedBundle = await saveMasterProfileToDatabase(
        nextProfile,
        updatedAt ?? undefined,
      );

      saveMasterProfileToLocalStorage(nextProfile);
      setProfile(nextProfile);

      setUpdatedAt(savedBundle.profile.updatedAt ?? null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdvancedSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-12">
        <Card className="border-border/60 space-y-6 border-dashed bg-zinc-500/2 p-6 md:col-span-4">
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <Database className="h-3 w-3" /> Data Context
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Version Control</span>
                <span className="text-accent font-mono">
                  {updatedAt ? "Cloud Synced" : "Local Only"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Modified</span>
                <span className="font-mono">
                  {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-border/40 flex flex-col gap-2 border-t pt-4">
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="justify-start gap-2"
            >
              <Link href="/profile">
                <ArrowLeft className="mr-1 h-3 w-3" /> Dashboard
              </Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="secondary"
              className="justify-start gap-2"
            >
              <Link href="/profile/master">
                <FileJson className="mr-1 h-3 w-3" /> Form Editor
              </Link>
            </Button>
          </div>
        </Card>

        <div className="flex h-fit items-start gap-4 rounded-3xl border border-orange-500/20 bg-orange-500/3 p-6 md:col-span-8">
          <ShieldAlert className="h-6 w-6 shrink-0 text-orange-500" />

          <div className="space-y-1">
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
              Handle with care
            </p>

            <p className="text-muted-foreground text-xs leading-relaxed">
              Modifying JSON directly can lead to schema inconsistencies. Ensure
              your objects match the required TypeScript definitions before
              committing changes to the database.
            </p>
          </div>
        </div>
      </div>

      <ProfileAdvanced
        isSaving={saving}
        profile={profile!}
        onSave={handleSave}
      />
    </div>
  );
};

function AdvancedSkeleton() {
  return (
    <Card className="animate-pulse space-y-6 rounded-3xl p-8">
      <div className="bg-muted h-4 w-24 rounded" />
      <div className="bg-muted h-10 w-64 rounded" />

      <div className="space-y-2">
        <div className="bg-muted h-4 w-full rounded" />
        <div className="bg-muted h-4 w-3/4 rounded" />
      </div>
    </Card>
  );
}

export default AdvancedProfileClient;

