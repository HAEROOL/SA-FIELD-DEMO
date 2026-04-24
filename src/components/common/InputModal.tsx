"use client";

import { useState, useEffect, useRef } from "react";
import ModalContainer from "@/components/common/ModalContainer";

interface InputModalProps {
  open: boolean;
  title: string;
  placeholder?: string;
  type?: "text" | "password";
  defaultValue?: string;
  confirmLabel?: string;
  allowEmpty?: boolean;
  /** 값 검증 함수. 에러 메시지 문자열을 반환하거나, 통과 시 null 반환 */
  validate?: (value: string) => string | null;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InputModal({
  open,
  title,
  placeholder,
  type = "text",
  defaultValue = "",
  confirmLabel = "확인",
  allowEmpty = false,
  validate,
  onConfirm,
  onCancel,
}: InputModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  // 열릴 때 포커스 및 에러 초기화 (ModalContainer가 !open 시 unmount하므로 defaultValue는 속성으로 처리됨)
  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      inputRef.current?.focus();
      setError(null);
    }, 0);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const value = inputRef.current?.value ?? "";
    if (!allowEmpty && !value.trim()) return;

    if (validate) {
      const errorMessage = validate(value);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }

    setError(null);
    onConfirm(value);
  };

  return (
    <ModalContainer open={open} onClose={onCancel}>
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">{title}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <input
            ref={inputRef}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            onChange={() => error && setError(null)}
            autoComplete={type === "password" ? "current-password" : "off"}
            className={`w-full bg-gray-50 dark:bg-brand-900 text-gray-900 dark:text-white text-sm border px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-bold transition"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </ModalContainer>
  );
}
