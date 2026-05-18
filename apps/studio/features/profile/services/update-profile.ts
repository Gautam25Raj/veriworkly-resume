import type { AccountProfile } from "@/features/profile/services/account-profile";

import { fetchApiData } from "@/utils/fetchApiData";

export async function updateAccountName(name: string): Promise<AccountProfile> {
  return fetchApiData<AccountProfile>("/users/me/name", {
    method: "PUT",
    body: JSON.stringify({ name }),
    errorMessage: "Failed to update profile name",
  });
}
