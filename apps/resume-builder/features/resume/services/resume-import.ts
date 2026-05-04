"use client";

import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import { parseResumeDataInput } from "@/features/resume/schemas/resume-storage-schema";

export async function importResumeFromFile(file: File) {
  const content = await file.text();
  const parsed = parseResumeDataInput(JSON.parse(content));

  if (!parsed) {
    throw new Error("Invalid resume JSON");
  }

  return normalizeResumeData(parsed);
}
