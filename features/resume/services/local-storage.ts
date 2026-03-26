import {
  RESUME_STORAGE_KEY,
  RESUME_ACTIVE_ID_STORAGE_KEY,
  RESUME_COLLECTION_STORAGE_KEY,
} from "@/lib/constants";

import type { ResumeData } from "@/types/resume";

interface ResumeCollection {
  version: 1;
  items: Record<string, ResumeData>;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function toCollection(items: Record<string, ResumeData>): ResumeCollection {
  return {
    version: 1,
    items,
  };
}

export function getActiveResumeIdFromLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(RESUME_ACTIVE_ID_STORAGE_KEY);
}

export function setActiveResumeIdInLocalStorage(resumeId: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(RESUME_ACTIVE_ID_STORAGE_KEY, resumeId);
}

export function loadResumeCollectionFromLocalStorage() {
  if (!isBrowser()) {
    return toCollection({});
  }

  const rawCollection = window.localStorage.getItem(
    RESUME_COLLECTION_STORAGE_KEY,
  );

  if (!rawCollection) {
    const legacy = loadLegacyResumeFromLocalStorage();

    if (!legacy) {
      return toCollection({});
    }

    const migratedCollection = toCollection({
      [legacy.id]: legacy,
    });

    saveResumeCollectionToLocalStorage(migratedCollection);
    setActiveResumeIdInLocalStorage(legacy.id);

    return migratedCollection;
  }

  try {
    const parsed = JSON.parse(rawCollection) as ResumeCollection;

    if (!parsed || typeof parsed !== "object" || !parsed.items) {
      return toCollection({});
    }

    return toCollection(parsed.items);
  } catch {
    window.localStorage.removeItem(RESUME_COLLECTION_STORAGE_KEY);
    return toCollection({});
  }
}

export function saveResumeCollectionToLocalStorage(
  collection: ResumeCollection,
) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    RESUME_COLLECTION_STORAGE_KEY,
    JSON.stringify(collection),
  );
}

function loadLegacyResumeFromLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(RESUME_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ResumeData;
  } catch {
    window.localStorage.removeItem(RESUME_STORAGE_KEY);
    return null;
  }
}

export function saveResumeToLocalStorage(resume: ResumeData) {
  if (!isBrowser()) {
    return;
  }

  const collection = loadResumeCollectionFromLocalStorage();

  collection.items[resume.id] = resume;
  saveResumeCollectionToLocalStorage(collection);
  setActiveResumeIdInLocalStorage(resume.id);

  window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
}

export function loadResumeFromLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  const collection = loadResumeCollectionFromLocalStorage();
  const activeId = getActiveResumeIdFromLocalStorage();

  if (activeId && collection.items[activeId]) {
    return collection.items[activeId];
  }

  const firstResume = Object.values(collection.items)[0] ?? null;

  if (firstResume) {
    setActiveResumeIdInLocalStorage(firstResume.id);
  }

  return firstResume;
}

export function loadResumeByIdFromLocalStorage(resumeId: string) {
  const collection = loadResumeCollectionFromLocalStorage();
  return collection.items[resumeId] ?? null;
}

export function listResumesFromLocalStorage() {
  const collection = loadResumeCollectionFromLocalStorage();

  return Object.values(collection.items).sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function deleteResumeFromLocalStorage(resumeId: string) {
  if (!isBrowser()) {
    return null;
  }

  const collection = loadResumeCollectionFromLocalStorage();

  if (!collection.items[resumeId]) {
    return getActiveResumeIdFromLocalStorage();
  }

  delete collection.items[resumeId];
  saveResumeCollectionToLocalStorage(collection);

  const remainingIds = Object.keys(collection.items);
  const nextId = remainingIds[0] ?? null;

  if (nextId) {
    setActiveResumeIdInLocalStorage(nextId);
    window.localStorage.setItem(
      RESUME_STORAGE_KEY,
      JSON.stringify(collection.items[nextId]),
    );
  } else {
    window.localStorage.removeItem(RESUME_ACTIVE_ID_STORAGE_KEY);
    window.localStorage.removeItem(RESUME_STORAGE_KEY);
  }

  return nextId;
}

export function clearResumeFromLocalStorage() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(RESUME_STORAGE_KEY);
  window.localStorage.removeItem(RESUME_COLLECTION_STORAGE_KEY);
  window.localStorage.removeItem(RESUME_ACTIVE_ID_STORAGE_KEY);
}
