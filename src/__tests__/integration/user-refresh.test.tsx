import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserHeader from '@/components/user/UserHeader';
import { PlayerInfo } from '@/apis/types/user.type';

// Mock next/navigation
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

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
  }

  close() {
    this.readyState = this.CLOSED;
  }

  simulateConnect() {
    const listeners = this.eventListeners.get('connect');
    if (listeners) {
      const event = new MessageEvent('connect', { data: 'connected!' });
      listeners.forEach(listener => listener(event));
    }
  }

  simulateComplete() {
    const listeners = this.eventListeners.get('COMPLETE');
    if (listeners) {
      const event = new MessageEvent('COMPLETE', { data: 'SUCCESS' });
      listeners.forEach(listener => listener(event));
    }
  }

  simulateError() {
    if (this.onerror) {
      this.onerror(new Event('error'));
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

describe('User Refresh Integration', () => {
  let mockEventSourceInstance: MockEventSource | null = null;

  const mockPlayerInfo: PlayerInfo = {
    laeguePlayerId: 1,
    playerId: 12345,
    nexonOuid: 'test-ouid-12345',
    nickName: 'TestPlayer',
    clanId: 123,
    clanMarkUrl: null,
    clanBackMarkUrl: null,
    clanName: 'Test Clan',

    totalKill: 1000,
    totalDeath: 500,
    totalWin: 100,
    totalLose: 50,
    mvpCount: 25,
    ladderPoint: 1500,
  };

  beforeEach(() => {
    mockEventSourceInstance = null;
    mockRefresh.mockClear();

    // Mock global EventSource
    global.EventSource = function (this: any, url: string) {
      mockEventSourceInstance = new MockEventSource(url);
      return mockEventSourceInstance;
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole('button', { name: /전적 갱신/i });
    await user.click(refreshButton);

    expect(screen.getByText(/갱신 중/i)).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });

  it('should complete full refresh flow with SSE', async () => {
    const user = userEvent.setup();
    render(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole('button', { name: /전적 갱신/i });
    await user.click(refreshButton);

    // Wait for EventSource to be created
    await waitFor(() => {
      expect(mockEventSourceInstance).not.toBeNull();
    });

    // Check URL is correct
    expect(mockEventSourceInstance?.url).toContain('/search/player/test-ouid-12345/refresh');

    // Simulate connect event
    mockEventSourceInstance?.simulateConnect();

    // Simulate complete event
    mockEventSourceInstance?.simulateComplete();

    // Should show success message
    await waitFor(() => {
      expect(screen.getByText(/전적이 갱신되었습니다/i)).toBeInTheDocument();
    });

    // Should trigger router.refresh()
    expect(mockRefresh).toHaveBeenCalled();

    // Button should be enabled again
    expect(refreshButton).not.toBeDisabled();
  });

  it('should show error message on SSE error', async () => {
    const user = userEvent.setup();
    render(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole('button', { name: /전적 갱신/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockEventSourceInstance).not.toBeNull();
    });

    // Simulate error
    mockEventSourceInstance?.simulateError();

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/갱신 중 오류가 발생했습니다/i)).toBeInTheDocument();
    });

    // Button should be enabled again
    expect(refreshButton).not.toBeDisabled();
  });

  it('should not start refresh if nexonOuid is missing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    const playerInfoWithoutOuid = { ...mockPlayerInfo, nexonOuid: '' };
    render(<UserHeader playerInfo={playerInfoWithoutOuid} />);

    const refreshButton = screen.getByRole('button', { name: /전적 갱신/i });
    await user.click(refreshButton);

    // Should not create EventSource
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockEventSourceInstance).toBeNull();

    // Should log error
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('nexonOuid'));

    consoleSpy.mockRestore();
  });

  it('should prevent multiple simultaneous refresh requests', async () => {
    const user = userEvent.setup();
    render(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole('button', { name: /전적 갱신/i });

    // Click twice quickly
    await user.click(refreshButton);
    await user.click(refreshButton);

    // Should only create one EventSource
    await waitFor(() => {
      expect(mockEventSourceInstance).not.toBeNull();
    });

    // Button should stay disabled
    expect(refreshButton).toBeDisabled();
  });

  it('should display player information correctly', () => {
    render(<UserHeader playerInfo={mockPlayerInfo} />);

    expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    expect(screen.getByText('Test Clan')).toBeInTheDocument();
    expect(screen.getByText(/1,500 Points/i)).toBeInTheDocument();
  });

  it('should display player with no clan correctly', () => {
    const playerInfoNoClan = {
      ...mockPlayerInfo,
      clanId: null,
      clanName: null,
      clanMarkUrl: null,
    clanBackMarkUrl: null,
    };
    render(<UserHeader playerInfo={playerInfoNoClan} />);

    expect(screen.getByText('TestPlayer')).toBeInTheDocument();
    // Clan name should not be shown
    expect(screen.queryByText('Test Clan')).not.toBeInTheDocument();
  });
});
