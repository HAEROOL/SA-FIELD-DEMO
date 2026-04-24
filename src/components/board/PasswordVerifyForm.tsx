"use client";

import { useState } from "react";
import { cn } from "@/components/ui/utils";

interface PasswordVerifyFormProps {
  title: string;
  description: string;
  submitLabel: string;
  submitClassName?: string;
  isSubmitting: boolean;
  error: string;
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
}

export default function PasswordVerifyForm({
  title,
  description,
  submitLabel,
  submitClassName = "bg-brand-600 hover:bg-brand-500 text-white",
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: PasswordVerifyFormProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await onSubmit(password);
  };

  return (
    <div className="w-full md:max-w-sm">
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{description}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className={cn(
              "w-full bg-gray-50 dark:bg-brand-900 text-gray-900 dark:text-white text-sm border px-3 py-2 focus:outline-none focus:border-brand-500 transition-colors",
              error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            )}
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-xs -mt-2">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white text-sm font-bold transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !password}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed",
                submitClassName
              )}
            >
              {isSubmitting ? `${submitLabel} 중...` : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
