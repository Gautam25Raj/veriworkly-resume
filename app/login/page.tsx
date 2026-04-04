"use client";

import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import OtpForm from "./component/OtpForm";

const LoginPage = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const { requestEmailOtp, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!email) {
      return;
    }

    const success = await requestEmailOtp(email);
    if (success) {
      setSentTo(email);
      setSent(true);
      setOtp("");
    }
  };

  if (sent)
    return (
      <OtpForm sentTo={sentTo} setSent={setSent} otp={otp} setOtp={setOtp} />
    );

  return (
    <Card className="relative min-h-140 overflow-hidden rounded-4xl p-7">
      <div className="bg-accent/12 pointer-events-none absolute -top-20 -left-16 h-52 w-52 rounded-full blur-3xl" />

      <div className="relative space-y-6">
        <div className="space-y-4">
          <Badge className="bg-background/70">Optional Login</Badge>

          <div className="space-y-3">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
              Use without login. Sign in for extras.
            </h1>

            <p className="text-muted max-w-md text-sm md:text-base">
              Resume building is fully available without an account. Login adds
              sync and advanced sharing features.
            </p>
          </div>
        </div>

        <div className="border-border/80 bg-background/65 rounded-2xl border p-3 backdrop-blur">
          <ul className="text-muted text-sm leading-6">
            <li>1. Master profile + derived resumes.</li>
            <li>2. Share links with expiry, password, and view controls.</li>
            <li>3. Per-resume sync toggle (default off).</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-foreground text-sm font-medium"
            >
              Email
            </label>

            <Input
              required
              id="email"
              type="email"
              value={email}
              disabled={isLoading}
              placeholder="hello@veriworkly.com"
              onChange={(e) => {
                setEmail(e.target.value);
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
            disabled={isLoading || !email}
          >
            {isLoading ? "Sending Code..." : "Send Sign-in Code"}
          </Button>
        </form>

        <p className="text-muted text-center text-xs md:text-sm">
          Want to continue immediately?
          <Link
            href="/dashboard"
            className="text-foreground ml-1 font-semibold hover:opacity-80"
          >
            Open Dashboard (No Login)
          </Link>
        </p>
      </div>
    </Card>
  );
};

export default LoginPage;
