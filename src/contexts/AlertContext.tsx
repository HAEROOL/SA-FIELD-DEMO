"use client";

import { createContext, useContext, useState, useCallback } from "react";
import AlertModal from "@/components/common/AlertModal";

interface AlertOptions {
  title?: string;
  confirmLabel?: string;
}

interface AlertContextValue {
  showAlert: (message: string, options?: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
  }>({ open: false, title: "알림", message: "", confirmLabel: "확인" });

  const showAlert = useCallback((message: string, options?: AlertOptions) => {
    setState({
      open: true,
      title: options?.title ?? "알림",
      message,
      confirmLabel: options?.confirmLabel ?? "확인",
    });
  }, []);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertModal
        open={state.open}
        title={state.title}
        message={state.message}
        confirmLabel={state.confirmLabel}
        onClose={handleClose}
      />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertModalProvider");
  return ctx;
}
