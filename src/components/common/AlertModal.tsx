"use client";

import ModalContainer from "@/components/common/ModalContainer";

interface AlertModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onClose: () => void;
}

export default function AlertModal({
  open,
  title,
  message,
  confirmLabel = "확인",
  onClose,
}: AlertModalProps) {
  return (
    <ModalContainer open={open} onClose={onClose}>
      <div className="flex items-center gap-2 mb-3">
        <i className="fas fa-exclamation-triangle text-red-500"></i>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line mb-4">
        {message}
      </p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          autoFocus
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition"
        >
          {confirmLabel}
        </button>
      </div>
    </ModalContainer>
  );
}
