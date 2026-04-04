import { randomUUID } from "node:crypto";

import { prisma } from "#utils/prisma";
import { ApiError } from "#utils/errors";
import { cacheDelByPrefix } from "#utils/redis";

import { Prisma } from "@prisma/client";

import { RoadmapStatus } from "../roadmapService";

interface RoadmapAdminCreateInput {
  id?: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  eta?: string;
  tags?: string[];
  fullDescription?: string | null;
  whyItMatters?: string | null;
  timeline?: string | null;
  startedAt?: Date;
  completedAt?: Date;
  completedQuarter?: string;
  details?: unknown;
}

interface RoadmapAdminUpdateInput {
  title?: string;
  description?: string;
  status?: RoadmapStatus;
  eta?: string | undefined;
  tags?: string[];
  fullDescription?: string | null;
  whyItMatters?: string | null;
  timeline?: string | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  completedQuarter?: string | null;
  details?: unknown | null;
}

function calculateQuarter(date: Date): string {
  const month = date.getMonth();
  const year = date.getFullYear();

  const quarter = Math.floor(month / 3) + 1;

  return `Q${quarter} ${year}`;
}

async function invalidateRoadmapCache(): Promise<void> {
  try {
    await cacheDelByPrefix("roadmap:");
  } catch {
    // Cache invalidation is best-effort and should not fail write operations.
  }
}

export async function createRoadmapFeature(input: RoadmapAdminCreateInput) {
  let startedAt: Date | null | undefined = input.startedAt;
  let completedAt: Date | null | undefined = input.completedAt;

  let completedQuarter: string | null = null;

  if (input.status === "todo") {
    startedAt = null;
    completedAt = null;
  } else if (input.status === "in-progress") {
    startedAt = startedAt || new Date();
    completedAt = null;
  } else if (input.status === "done") {
    startedAt = startedAt || new Date();
    completedAt = completedAt || new Date();
    completedQuarter = calculateQuarter(completedAt);
  }

  const feature = await prisma.roadmapFeature.create({
    data: {
      id: input.id || randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      eta: input.eta,
      tags: input.tags ?? [],
      fullDescription: input.fullDescription ?? null,
      whyItMatters: input.whyItMatters ?? null,
      timeline: input.timeline ?? null,
      startedAt,
      completedAt,
      completedQuarter,
      details: input.details as object | undefined,
    },
  });

  await invalidateRoadmapCache();
  return feature;
}

export async function updateRoadmapFeature(id: string, input: RoadmapAdminUpdateInput) {
  const existing = await prisma.roadmapFeature.findUnique({
    where: { id },
    select: { id: true, status: true, startedAt: true, completedAt: true },
  });

  if (!existing) {
    throw new ApiError(404, "Roadmap feature not found");
  }

  const targetStatus = input.status ?? existing.status;

  let finalStartedAt = input.startedAt !== undefined ? input.startedAt : existing.startedAt;
  let finalCompletedAt = input.completedAt !== undefined ? input.completedAt : existing.completedAt;

  let finalCompletedQuarter: string | null = null;

  if (targetStatus === "todo") {
    finalStartedAt = null;
    finalCompletedAt = null;
  } else if (targetStatus === "in-progress") {
    finalStartedAt = finalStartedAt || new Date();
    finalCompletedAt = null;
  } else if (targetStatus === "done") {
    finalStartedAt = finalStartedAt || new Date();
    finalCompletedAt = finalCompletedAt || new Date();
    finalCompletedQuarter = calculateQuarter(finalCompletedAt);
  }

  const normalizedDetails =
    input.details === undefined
      ? undefined
      : input.details === null
        ? Prisma.JsonNull
        : (input.details as Prisma.InputJsonValue);

  const feature = await prisma.roadmapFeature.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.eta !== undefined ? { eta: input.eta } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.fullDescription !== undefined ? { fullDescription: input.fullDescription } : {}),
      ...(input.whyItMatters !== undefined ? { whyItMatters: input.whyItMatters } : {}),
      ...(input.timeline !== undefined ? { timeline: input.timeline } : {}),
      ...(normalizedDetails !== undefined ? { details: normalizedDetails } : {}),
      startedAt: finalStartedAt,
      completedAt: finalCompletedAt,
      completedQuarter: finalCompletedQuarter,
    },
  });

  await invalidateRoadmapCache();
  return feature;
}

export async function deleteRoadmapFeature(id: string) {
  const existing = await prisma.roadmapFeature.findUnique({ where: { id }, select: { id: true } });

  if (!existing) {
    throw new ApiError(404, "Roadmap feature not found");
  }

  await prisma.roadmapFeature.delete({ where: { id } });
  await invalidateRoadmapCache();

  return { id };
}
