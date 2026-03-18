"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface DestructiveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  /** What is being deleted (resume, template, etc.) */
  entityName?: string;

  /** Optional custom title */
  title?: string;

  /** Optional custom description */
  description?: string;

  /** Confirmation keyword (default: DELETE) */
  confirmText?: string;

  /** Optional stronger warning */
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

  const isValid = value === confirmText;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirm();
    setValue("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{title ?? `Delete ${entityName}?`}</Modal.Title>

          <Modal.Description>
            {description ?? `This action is permanent and cannot be undone.`}
          </Modal.Description>
        </Modal.Header>

        <Modal.Body className="space-y-5">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-500">
              {warningText ??
                `You are about to permanently delete this ${entityName}.`}
            </p>

            <p className="text-muted mt-1 text-sm">
              This action cannot be reversed.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-muted text-sm">
              Type{" "}
              <span className="text-foreground font-semibold">
                {confirmText}
              </span>{" "}
              to confirm.
            </p>

            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type ${confirmText}`}
              autoFocus
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!isValid}
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Permanently Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default DestructiveModal;
