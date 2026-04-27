"use client";

import { useState, useEffect } from "react";

import { useUserStore } from "@/store/useUserStore";

import { Card } from "@veriworkly/ui";
import { Input } from "@veriworkly/ui";
import { Button } from "@veriworkly/ui";

import { updateCurrentUserName } from "@/features/auth/services/current-user";

export default function NameEditor() {
  const [busy, setBusy] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const { user, setUser, loading } = useUserStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNameDraft(user?.name ?? "");
  }, [user?.name]);

  const isChanged = nameDraft.trim() !== (user?.name ?? "").trim();

  async function handleSave() {
    if (!nameDraft.trim() || !isChanged) return;

    setBusy(true);

    try {
      const updated = await updateCurrentUserName(nameDraft.trim());
      setUser(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-accent/20 bg-accent/2 space-y-4 p-6">
      <div className="space-y-1">
        <label className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          Display Name
        </label>

        <Input
          inputSize="sm"
          value={nameDraft}
          className="bg-background"
          disabled={loading || busy}
          onChange={(e) => setNameDraft(e.target.value)}
        />
      </div>

      <Button
        size="sm"
        loading={busy}
        onClick={handleSave}
        disabled={!isChanged || busy}
        className="h-8 w-full text-[10px] font-bold tracking-wider uppercase"
      >
        Save Changes
      </Button>
    </Card>
  );
}
