import type {
  RoadmapStatus,
  RoadmapFeature,
} from "@/features/roadmap/services/roadmap-backend";

import { fetchApiData } from "@/utils/fetchApiData";

export interface AdminRoadmapPayload {
  title: string;
  description: string;
  status: RoadmapStatus;
  eta?: string | null;
  tags?: string[];
  fullDescription?: string | null;
  whyItMatters?: string | null;
  timeline?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  details?: Record<string, unknown> | null;
  completedQuarter?: string | null;
}

export async function createRoadmapFeature(payload: AdminRoadmapPayload) {
  return fetchApiData<RoadmapFeature>("/roadmap/admin", {
    method: "POST",
    body: JSON.stringify(payload),
    errorMessage: "Failed to create roadmap feature",
  });
}

export async function updateRoadmapFeature(
  id: string,
  payload: Partial<AdminRoadmapPayload>,
) {
  return fetchApiData<RoadmapFeature>(`/roadmap/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    errorMessage: "Failed to update roadmap feature",
  });
}

export async function deleteRoadmapFeature(id: string) {
  return fetchApiData<{ id: string }>(`/roadmap/admin/${id}`, {
    method: "DELETE",
    errorMessage: "Failed to delete roadmap feature",
  });
}
