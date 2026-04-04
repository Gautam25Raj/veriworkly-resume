import { useCallback, useState } from "react";

import { backendApiUrl } from "@/lib/constants";

import { trackUsageEvent } from "@/features/analytics/services/usage-metrics";

export interface AuthError {
  message: string;
  code?: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const requestEmailOtp = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        backendApiUrl("/auth/email-otp/send-verification-otp"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            type: "sign-in",
          }),
          credentials: "include",
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || `Failed to send OTP (${response.status})`,
        );
      }

      trackUsageEvent({ event: "auth_otp_sent" });

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setError({ message, code: "OTP_SEND_ERROR" });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithEmailOtp = useCallback(async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(backendApiUrl("/auth/sign-in/email-otp"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || `Failed to verify OTP (${response.status})`,
        );
      }

      trackUsageEvent({ event: "auth_login_success" });

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setError({ message, code: "OTP_VERIFY_ERROR" });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    requestEmailOtp,
    signInWithEmailOtp,
    isLoading,
    error,
    clearError,
  };
}
