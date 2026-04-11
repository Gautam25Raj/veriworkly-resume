"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

import { deleteRoadmapFeature } from "@/features/roadmap/services/admin-roadmap";

export default function DeleteRoadmapButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete roadmap item \"${title}\"?`);

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteRoadmapFeature(id);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button size="sm" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
