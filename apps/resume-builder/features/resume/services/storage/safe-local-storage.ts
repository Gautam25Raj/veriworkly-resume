export type LocalStorageWriteResult =
  | { ok: true }
  | { ok: false; reason: "quota-exceeded" | "unknown" };

function isQuotaExceededError(error: unknown) {
  if (!(error instanceof DOMException)) {
    return false;
  }

  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
}

export function safeSetLocalStorageItem(
  storage: Storage,
  key: string,
  value: string,
): LocalStorageWriteResult {
  try {
    storage.setItem(key, value);
    return { ok: true };
  } catch (error) {
    if (isQuotaExceededError(error)) {
      return { ok: false, reason: "quota-exceeded" };
    }

    return { ok: false, reason: "unknown" };
  }
}
