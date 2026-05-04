import { backendApiUrl } from "@/lib/constants";

interface UsageEventPayload {
  event: string;
  value?: number;
}

export async function trackUsageEvent(payload: UsageEventPayload) {
  if (!payload.event) return;

  try {
    const response = await fetch(backendApiUrl("/stats/events"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      keepalive: true,
      body: JSON.stringify({
        event: payload.event,
        value: payload.value ?? 1,
      }),
    });

    if (!response.ok && process.env.NODE_ENV === "development") {
      console.warn(`Metrics failed: ${response.status} ${response.statusText}`);
    }
  } catch {}
}
