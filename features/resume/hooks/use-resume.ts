"use client";

import { useResumeStore } from "@/features/resume/store/resume-store";

export function useResume() {
  return useResumeStore();
}
