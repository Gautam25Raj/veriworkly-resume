"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { fetchApiData } from "@/utils/fetchApiData";

const AdminActionButtons = () => {
  const router = useRouter();

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);

      await fetchApiData("/github/admin/sync", {
        method: "POST",
      });

      router.refresh();
    } catch (error) {
      console.error("Failed to sync GitHub:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await fetchApiData("/auth/sign-out", {
        method: "POST",
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <Button
        size="md"
        variant="secondary"
        disabled={isSyncing}
        onClick={handleSyncNow}
      >
        {isSyncing ? "Syncing GitHub..." : "Sync GitHub Now"}
      </Button>

      <Button
        size="md"
        variant="secondary"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  );
};

export default AdminActionButtons;
