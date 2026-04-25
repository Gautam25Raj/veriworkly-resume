"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface DestructiveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  warningText?: string;
}

const DestructiveModal = ({
  open,
  onClose,
  onConfirm,
  entityName = "item",
  title,
  description,
  confirmText = "DELETE",
  warningText,
}: DestructiveModalProps) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) {
      // Reset value asynchronously to avoid state update during effect
      const timer = setTimeout(() => setValue(""), 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const isValid = value.trim().toUpperCase() === confirmText.toUpperCase();

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content className="w-full max-w-md overflow-hidden p-0 sm:rounded-xl">
        <div className="border-destructive/10 bg-destructive/5 flex items-center gap-3 border-b px-4 py-4 md:bg-red-50/50 dark:md:bg-red-950/20">
          <div className="bg-destructive/10 text-destructive flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <Trash2 className="h-5 w-5" />
          </div>

          <div>
            <Modal.Title className="text-foreground text-base font-bold">
              {title ?? `Delete ${entityName}?`}
            </Modal.Title>

            <p className="text-destructive/80 text-[11px] font-medium tracking-wider uppercase">
              Critical Action
            </p>
          </div>
        </div>

        <Modal.Body className="space-y-6 p-4">
          <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3.5">
            <div className="flex gap-3">
              <AlertTriangle className="text-destructive h-5 w-5 shrink-0" />

              <div className="space-y-1">
                <p className="text-destructive text-sm leading-none font-bold">
                  {warningText ?? "This action cannot be undone"}
                </p>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {description ??
                    `You are about to permanently remove this ${entityName}. Local data and cloud syncs will be purged.`}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-muted-foreground/70 text-[10px] font-bold tracking-widest uppercase">
                Verification Required
              </label>

              <p className="text-muted-foreground text-[13px]">
                To confirm, type{" "}
                <span className="bg-destructive/10 text-destructive decoration-destructive/30 inline-flex items-center rounded py-0.5 font-mono text-xs font-bold underline underline-offset-2">
                  {confirmText}
                </span>{" "}
                below.
              </p>
            </div>

            <Input
              autoFocus
              value={value}
              inputSize="sm"
              variant="outline"
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type ${confirmText} to proceed`}
              className="border-border hover:border-destructive/30 focus-visible:border-destructive/50 focus-visible:ring-destructive/10 h-10"
            />
          </div>
        </Modal.Body>

        <div className="flex flex-col-reverse gap-2 border-t bg-zinc-50/50 p-4 sm:flex-row sm:justify-end dark:bg-zinc-900/50">
          <Button
            onClick={onClose}
            variant="secondary"
            className="h-9 w-full text-xs sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            disabled={!isValid}
            onClick={handleConfirm}
            className="h-9 w-full bg-red-600 px-6 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-30 sm:w-auto"
          >
            Confirm Deletion
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default DestructiveModal;
