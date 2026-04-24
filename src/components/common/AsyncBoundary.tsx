"use client";

import { Suspense, ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import Loader from "./Loader";

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  rejectedFallback?: ReactNode;
  onReset?: () => void;
}

export default function AsyncBoundary({
  children,
  pendingFallback = <Loader />,
  rejectedFallback,
  onReset,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={rejectedFallback} onReset={onReset}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
