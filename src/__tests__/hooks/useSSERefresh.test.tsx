import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSSERefresh } from '@/hooks/useSSERefresh';

// Mock EventSource
class MockEventSource {
  url: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState: number = 0;
  CONNECTING = 0;
  OPEN = 1;
  CLOSED = 2;
  private eventListeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();

  constructor(url: string) {
    this.url = url;
    this.readyState = this.CONNECTING;

    // Simulate connection after a tick
    setTimeout(() => {
      this.readyState = this.OPEN;
    }, 0);
  }

  close() {
    this.readyState = this.CLOSED;
  }

  // Helper method for tests to simulate events
  simulateMessage(data: string, eventType?: string) {
    const messageEvent = new MessageEvent(eventType || 'message', {
      data,
      lastEventId: '',
      origin: this.url,
    });

    // If event type specified, call listeners for that event
    if (eventType) {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.forEach(listener => listener(messageEvent));
      }
    } else if (this.onmessage) {
      this.onmessage(messageEvent);
    }
  }

  addEventListener(eventType: string, handler: (e: MessageEvent) => void) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(handler);
  }

  removeEventListener(eventType: string, handler: (e: MessageEvent) => void) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(handler);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
}

describe('useSSERefresh', () => {
  let mockEventSourceInstances: MockEventSource[] = [];

  beforeEach(() => {
    mockEventSourceInstances = [];

    // Mock global EventSource using a function constructor
    global.EventSource = function (this: any, url: string) {
      const instance = new MockEventSource(url);
      mockEventSourceInstances.push(instance);
      return instance;
    } as any;

    // Copy static properties
    (global.EventSource as any).CONNECTING = 0;
    (global.EventSource as any).OPEN = 1;
    (global.EventSource as any).CLOSED = 2;

    vi.useFakeTimers();
  });

  afterEach(() => {
    mockEventSourceInstances = [];
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should have initial state with isRefreshing false', () => {
    const { result } = renderHook(() => useSSERefresh());

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(false);
  });

  it('should start refresh when startRefresh is called', async () => {
    const { result } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh');
    });

    expect(result.current.isRefreshing).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle connect event', async () => {
    const onConnect = vi.fn();
    const { result } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh', { onConnect });
    });

    // Wait for EventSource to be created
    await vi.advanceTimersByTimeAsync(10);

    expect(mockEventSourceInstances.length).toBe(1);

    const eventSourceInstance = mockEventSourceInstances[0];

    // Simulate connect event
    await act(async () => {
      eventSourceInstance.simulateMessage('connected!', 'connect');
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(onConnect).toHaveBeenCalledWith('connected!');
  });

  it('should handle COMPLETE event and set success state', async () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh', { onComplete });
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(mockEventSourceInstances.length).toBe(1);
    const eventSourceInstance = mockEventSourceInstances[0];

    // Simulate COMPLETE event
    await act(async () => {
      eventSourceInstance.simulateMessage('SUCCESS', 'COMPLETE');
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(onComplete).toHaveBeenCalledWith('SUCCESS');
  });

  it('should handle error event', async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh', { onError });
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(mockEventSourceInstances.length).toBe(1);
    const eventSourceInstance = mockEventSourceInstances[0];

    // Simulate error
    await act(async () => {
      if (eventSourceInstance.onerror) {
        eventSourceInstance.onerror(new Event('error'));
      }
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(onError).toHaveBeenCalled();
  });

  it('should close EventSource on unmount', async () => {
    const { result, unmount } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh');
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(mockEventSourceInstances.length).toBe(1);
    const eventSourceInstance = mockEventSourceInstances[0];
    const closeSpy = vi.spyOn(eventSourceInstance, 'close');

    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should set success state on COMPLETE event', async () => {
    const { result } = renderHook(() => useSSERefresh());

    await act(async () => {
      result.current.startRefresh('/search/clan/12345/refresh');
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(mockEventSourceInstances.length).toBe(1);
    const eventSourceInstance = mockEventSourceInstances[0];

    // Simulate COMPLETE event
    await act(async () => {
      eventSourceInstance.simulateMessage('SUCCESS', 'COMPLETE');
    });

    // Success state should be true after COMPLETE
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
  });

  it('should not start new refresh if already refreshing', async () => {
    const { result } = renderHook(() => useSSERefresh());

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh');
    });

    await vi.advanceTimersByTimeAsync(10);

    const firstCount = mockEventSourceInstances.length;

    act(() => {
      result.current.startRefresh('/search/clan/12345/refresh');
    });

    expect(mockEventSourceInstances.length).toBe(firstCount);
  });
});
