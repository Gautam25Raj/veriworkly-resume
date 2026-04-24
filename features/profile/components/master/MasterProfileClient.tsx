"use client";

import Link from "next/link";
import { ChevronRight, Circle, Compass, ArrowUp } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";

import type { MasterProfileData } from "@/types/resume";

import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/Card";

import ProfileMaster from "./ProfileMaster";

import {
  saveMasterProfileToDatabase,
  loadMasterProfileFromDatabase,
  saveMasterProfileToLocalStorage,
  loadMasterProfileFromLocalStorage,
} from "@/features/resume/services/master-profile";

type CountKey = "experience" | "projects" | "skills";

type MasterSectionNavItem = {
  id: string;
  label: string;
  countKey?: CountKey;
};

const MASTER_SECTION_NAV: MasterSectionNavItem[] = [
  { id: "profile-basics", label: "Resume Basics" },
  { id: "profile-summary-links", label: "Summary and Links" },
  { id: "profile-appearance", label: "Appearance" },
  { id: "profile-visibility", label: "Section Visibility" },
  { id: "profile-experience", label: "Experience", countKey: "experience" },
  { id: "profile-education", label: "Education" },
  { id: "profile-projects", label: "Projects", countKey: "projects" },
  { id: "profile-skills", label: "Skills", countKey: "skills" },
  { id: "profile-languages", label: "Languages" },
  { id: "profile-interests", label: "Interests" },
  { id: "profile-credentials", label: "Awards, Certificates, Publications" },
  { id: "profile-volunteer", label: "Volunteer" },
  { id: "profile-references", label: "References" },
  { id: "profile-achievements", label: "Achievements" },
  { id: "profile-custom-sections", label: "Custom Sections" },
];

export default function MasterProfileClient() {
  const [state, setState] = useState<{
    profile: MasterProfileData | null;
    source: "database" | "local" | null;
    updatedAt: string | null;
  }>({ profile: null, source: null, updatedAt: null });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeSectionId, setActiveSectionId] = useState<string>(
    MASTER_SECTION_NAV[0].id,
  );

  const isManualScrolling = useRef(false);

  const sourceLabel =
    state.source === "database"
      ? "Database"
      : state.source === "local"
        ? "Local cache"
        : "Unknown";

  const sectionCounts = useMemo(() => {
    if (!state.profile) return { experience: 0, projects: 0, skills: 0 };

    return {
      experience: state.profile.experience?.length ?? 0,
      projects: state.profile.projects?.length ?? 0,
      skills: state.profile.skills?.length ?? 0,
    };
  }, [state.profile]);

  const activeSectionIndex = MASTER_SECTION_NAV.findIndex(
    (s) => s.id === activeSectionId,
  );

  useEffect(() => {
    const load = async () => {
      try {
        const bundle = await loadMasterProfileFromDatabase();

        if (bundle?.profile) {
          setState({
            profile: bundle.profile,
            source: "database",
            updatedAt: bundle.updatedAt,
          });
        } else {
          const local = loadMasterProfileFromLocalStorage();

          setState({
            profile: local.profile,
            source: "local",
            updatedAt: null,
          });
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (loading || !state.profile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling.current) return;

        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveSectionId(visibleEntry.target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    MASTER_SECTION_NAV.forEach((section) => {
      const el = document.getElementById(section.id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, state.profile]);

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);

    if (!target) return;

    isManualScrolling.current = true;
    setActiveSectionId(sectionId);

    const topOffset = window.innerWidth >= 1280 ? 100 : 140;
    const y = target.getBoundingClientRect().top + window.scrollY - topOffset;

    window.scrollTo({ top: y, behavior: "smooth" });

    setTimeout(() => {
      isManualScrolling.current = false;
    }, 800);
  }, []);

  const handleSave = async (profile: MasterProfileData) => {
    setSaving(true);

    try {
      const savedBundle = await saveMasterProfileToDatabase(
        profile,
        state.updatedAt ?? undefined,
      );

      saveMasterProfileToLocalStorage(savedBundle.profile);

      setState({
        profile: savedBundle.profile,
        source: "database",
        updatedAt: savedBundle.updatedAt,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !state.profile) return <MasterSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
      <aside className="xl:col-span-3">
        <div className="sticky top-24 space-y-5">
          <Card className="border-dashed bg-zinc-500/5 p-4">
            <header className="mb-4 flex items-center gap-2">
              <Compass className="text-accent h-4 w-4" />

              <h4 className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                Navigator
              </h4>
            </header>

            <div className="mb-6 space-y-2 border-b border-dashed pb-4 text-[11px]">
              <StatRow label="Source" value={sourceLabel} />

              <StatRow
                isMono
                label="Updated"
                value={
                  state.updatedAt
                    ? new Date(state.updatedAt).toLocaleDateString()
                    : "New"
                }
              />

              <StatRow
                label="Progress"
                value={`${activeSectionIndex + 1} / ${MASTER_SECTION_NAV.length}`}
              />
            </div>

            <nav
              className="custom-scrollbar max-h-[50vh] space-y-1 overflow-y-auto pr-1"
              aria-label="Sections"
            >
              {MASTER_SECTION_NAV.map((section) => (
                <NavButton
                  key={section.id}
                  section={section}
                  isActive={activeSectionId === section.id}
                  count={
                    section.countKey
                      ? sectionCounts[section.countKey]
                      : undefined
                  }
                  onClick={() => scrollToSection(section.id)}
                />
              ))}
            </nav>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/5 mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-2 text-xs font-bold transition-all"
            >
              <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </button>
          </Card>

          <nav className="hidden flex-col gap-1 px-2 xl:flex">
            <ToolLink href="/profile" label="Back to Profile" />
            <ToolLink href="/profile/advanced" label="Advanced JSON" />
          </nav>
        </div>
      </aside>

      <main className="xl:col-span-9">
        <div className="bg-background/80 sticky top-18 z-30 -mx-4 mb-6 border-y px-4 py-3 backdrop-blur-md xl:hidden">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {MASTER_SECTION_NAV.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition",
                  activeSectionId === section.id
                    ? "bg-accent text-white"
                    : "bg-muted/50 text-muted-foreground",
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        <ProfileMaster
          profile={state.profile}
          onSave={handleSave}
          isSaving={saving}
        />
      </main>
    </div>
  );
}

const StatRow = ({
  label,
  value,
  isMono,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-semibold", isMono && "font-mono")}>{value}</span>
  </div>
);

interface NavButtonProps {
  section: MasterSectionNavItem;
  isActive: boolean;
  count?: number;
  onClick: () => void;
}

const NavButton = ({ section, isActive, count, onClick }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-all",
      isActive
        ? "bg-accent/10 text-accent font-bold"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    )}
  >
    <Circle
      className={cn(
        "h-2 w-2 transition-transform",
        isActive ? "scale-125 fill-current" : "opacity-40",
      )}
    />

    <span className="flex-1 truncate">{section.label}</span>
    {count !== undefined && (
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[9px]",
          count > 0
            ? "bg-emerald-500/10 text-emerald-600"
            : "bg-zinc-500/10 text-zinc-500",
        )}
      >
        {count}
      </span>
    )}
  </button>
);

const ToolLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="text-muted-foreground hover:text-accent flex items-center gap-2 py-1.5 text-[11px] font-medium transition-colors"
  >
    <ChevronRight className="h-3 w-3" /> {label}
  </Link>
);

function MasterSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-8 xl:grid-cols-12">
      <div className="hidden xl:col-span-3 xl:block">
        <div className="bg-muted/20 h-125 w-full rounded-2xl" />
      </div>

      <div className="space-y-6 xl:col-span-9">
        <div className="bg-muted/10 h-20 w-full rounded-2xl" />
        <div className="bg-muted/10 h-150 w-full rounded-2xl" />
      </div>
    </div>
  );
}
