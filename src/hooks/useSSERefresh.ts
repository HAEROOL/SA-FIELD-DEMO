import { useState, useEffect, useRef, useCallback } from 'react';

export interface SSERefreshOptions {
  onConnect?: (data: string) => void;
  onComplete?: (data: string) => void;
  onError?: (error: Error) => void;
}

export interface SSERefreshState {
  isRefreshing: boolean;
  isSuccess: boolean;
  error: Error | null;
  startRefresh: (url: string, options?: SSERefreshOptions) => void;
}

/**
 * Custom hook for handling SSE-based refresh operations
 *
 * @returns {SSERefreshState} State and controls for SSE refresh
 *
 * @example
 * const { isRefreshing, isSuccess, error, startRefresh } = useSSERefresh();
 *
 * const handleRefresh = () => {
 *   startRefresh('/search/clan/12345/refresh', {
 *     onConnect: (data) => console.log('Connected:', data),
 *     onComplete: (data) => console.log('Complete:', data),
 *     onError: (err) => console.error('Error:', err)
 *   });
 * };
 */
export function useSSERefresh(): SSERefreshState {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startRefresh = useCallback((url: string, options?: SSERefreshOptions) => {
    // Don't start if already refreshing
    if (isRefreshing) {
      return;
    }

    // Reset states
    setIsRefreshing(true);
    setIsSuccess(false);
    setError(null);

    // Cleanup previous connection if exists
    cleanup();

    try {
      // Create full URL with API base
      const baseURL = process.env.NEXT_PUBLIC_REFRESH_URL || 'http://localhost:3000/api';
      const fullUrl = `${baseURL}${url}`;

      // Create EventSource connection
      const eventSource = new EventSource(fullUrl);
      eventSourceRef.current = eventSource;

      // Handle connect event
      eventSource.addEventListener('connect', (event: MessageEvent) => {
        if (options?.onConnect) {
          options.onConnect(event.data);
        }
      });

      // Handle COOLDOWN event
      eventSource.addEventListener('COOLDOWN', (event: MessageEvent) => {
        setIsRefreshing(false);
        const data = event.data;
        const errMsg = data ? data : '갱신은 5분에 한 번만 가능합니다.';
        const err = new Error(errMsg);
        setError(err);

        if (options?.onError) {
          options.onError(err);
        }

        cleanup();

        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
        }, 3000);
      });

      // Handle COMPLETE event
      eventSource.addEventListener('COMPLETE', (event: MessageEvent) => {
        setIsRefreshing(false);
        setIsSuccess(true);

        if (options?.onComplete) {
          options.onComplete(event.data);
        }

        // Close connection before setting timeout so cleanup() doesn't cancel it
        cleanup();

        // Auto-hide success message after 3 seconds
        successTimeoutRef.current = setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      });

      // Handle errors
      eventSource.onerror = () => {
        const err = new Error('SSE 연결 중 오류가 발생했습니다.');
        setIsRefreshing(false);
        setError(err);

        if (options?.onError) {
          options.onError(err);
        }

        cleanup();

        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
        }, 3000);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      setIsRefreshing(false);
      setError(error);

      if (options?.onError) {
        options.onError(error);
      }
    }
  }, [isRefreshing, cleanup]);

  return {
    isRefreshing,
    isSuccess,
    error,
    startRefresh,
  };
}
