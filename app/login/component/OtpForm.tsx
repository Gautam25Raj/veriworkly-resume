"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { useAuth } from "@/hooks/use-auth";

const OtpForm = ({
  sentTo,
  setSent,
  otp,
  setOtp,
}: {
  sentTo: string;
  setSent: React.Dispatch<React.SetStateAction<boolean>>;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(60);

  const { requestEmailOtp, signInWithEmailOtp, isLoading, error, clearError } =
    useAuth();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!sentTo || !otp) return;

    const success = await signInWithEmailOtp(sentTo, otp);

    if (success) {
      router.push("/admin");
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    clearError();

    const success = await requestEmailOtp(sentTo);

    if (success) {
      setTimeLeft(60);
      setOtp("");
    }
  };

  return (
    <Card className="relative min-h-140 overflow-hidden rounded-4xl p-7">
      <div className="bg-accent/10 pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl" />

      <div className="relative space-y-6">
        <div className="space-y-4">
          <Badge className="bg-background/70">Secure Verification</Badge>

          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
              Check your email
            </h1>

            <p className="text-muted text-sm leading-6 md:text-base">
              We sent a secure sign-in code to
              <span className="text-foreground mx-1.5 font-semibold">
                {sentTo}
              </span>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="cursor-pointer text-sm font-medium text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Change
              </button>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="border-border/80 bg-background/65 rounded-2xl border p-3 backdrop-blur">
            <p className="text-muted text-sm">
              Enter the 6-digit code below. If you do not see the email, check
              your spam or promotions folder.
            </p>
          </div>

          <div className="border-border/80 rounded-2xl border bg-yellow-100/65 p-3 backdrop-blur dark:bg-yellow-300/5">
            <p className="text-muted text-sm">
              <span className="text-foreground font-medium">Tip:</span> Keep
              this tab open while you check your inbox. If you don't see it,
              check your spam folder.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="text-foreground text-sm font-medium"
            >
              Verification Code
            </label>

            <Input
              required
              id="otp"
              type="text"
              value={otp}
              minLength={6}
              maxLength={6}
              inputMode="numeric"
              disabled={isLoading}
              autoComplete="one-time-code"
              placeholder="Enter 6-digit code"
              onChange={(event) => {
                setOtp(event.target.value.replace(/\s+/g, ""));
                clearError();
              }}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200/60 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/80 dark:bg-red-950/40 dark:text-red-300">
              {error.message}
            </div>
          )}

          <Button
            size="md"
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length < 4}
          >
            {isLoading ? "Verifying Code..." : "Verify & Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted">Didn't receive the code? </span>

          {timeLeft > 0 ? (
            <span className="text-muted-foreground font-medium">
              Resend in {timeLeft}s
            </span>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleResend}
              className="cursor-pointer font-medium text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default OtpForm;
