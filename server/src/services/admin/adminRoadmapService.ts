import { randomUUID } from "node:crypto";

import { prisma } from "@/utils/prisma";
import { ApiError } from "@/utils/errors";
import { cacheDelByPrefix } from "@/utils/redis";

import { Prisma } from "@prisma/client";

import { RoadmapStatus } from "../roadmapService";

interface RoadmapAdminCreateInput {
  id?: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  eta?: string;
  tags?: string[];
  startedAt?: Date;
  completedAt?: Date;
  completedQuarter?: string;
  details?: unknown;
}

interface RoadmapAdminUpdateInput {
  title?: string;
  description?: string;
  status?: RoadmapStatus;
  eta?: string;
  tags?: string[];
  startedAt?: Date | null;
  completedAt?: Date | null;
  completedQuarter?: string | null;
  details?: unknown | null;
}

async function invalidateRoadmapCache(): Promise<void> {
  try {
    await cacheDelByPrefix("roadmap:");
  } catch {
    // Cache invalidation is best-effort and should not fail write operations.
  }
}

export async function createRoadmapFeature(input: RoadmapAdminCreateInput) {
  const feature = await prisma.roadmapFeature.create({
    data: {
      id: input.id || randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      eta: input.eta,
      tags: input.tags ?? [],
      startedAt: input.startedAt,
      completedAt: input.completedAt,
      completedQuarter: input.completedQuarter,
      details: input.details as object | undefined,
    },
  });

  await invalidateRoadmapCache();
  return feature;
}

export async function updateRoadmapFeature(id: string, input: RoadmapAdminUpdateInput) {
  const existing = await prisma.roadmapFeature.findUnique({ where: { id }, select: { id: true } });

  if (!existing) {
    throw new ApiError(404, "Roadmap feature not found");
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
      ...(input.startedAt !== undefined ? { startedAt: input.startedAt } : {}),
      ...(input.completedAt !== undefined ? { completedAt: input.completedAt } : {}),
      ...(input.completedQuarter !== undefined ? { completedQuarter: input.completedQuarter } : {}),
      ...(normalizedDetails !== undefined ? { details: normalizedDetails } : {}),
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
