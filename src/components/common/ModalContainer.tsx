"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalContainerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalContainer({ open, onClose, children }: ModalContainerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-sm mx-4 p-6">
        {children}
      </div>
    </div>,
    document.body
  );
}
