import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserHeader from "@/components/user/UserHeader";
import { renderWithProviders } from "../../utils/test-utils";
import { PlayerInfo } from "@/apis/types/user.type";

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

// Mock EventSource to prevent SSE connections during tests
class MockEventSource {
  url: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState: number = 0;
  CONNECTING = 0;
  OPEN = 1;
  CLOSED = 2;

  constructor(url: string) {
    this.url = url;
    this.readyState = this.CONNECTING;
  }

  close() {
    this.readyState = this.CLOSED;
  }

  addEventListener() {}
  removeEventListener() {}
}

global.EventSource = MockEventSource as any;

const mockPlayerInfo: PlayerInfo = {
  laeguePlayerId: 1,
  playerId: 12345,
  nexonOuid: 'test-ouid-12345',
  nickName: "sa_king☆",
  clanId: 10,
  clanName: "Ultron Clan",
  clanMarkUrl: null,
  clanBackMarkUrl: null,

  totalKill: 1000,
  totalDeath: 500,
  totalWin: 100,
  totalLose: 50,
  mvpCount: 25,
  ladderPoint: 2850,
};

beforeEach(() => {
  mockRefresh.mockClear();
});

describe("UserHeader", () => {
  it("사용자 이름이 표시되어야 한다", () => {
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    expect(screen.getByText("sa_king☆")).toBeInTheDocument();
  });

  it("사용자 등급 배지가 표시되어야 한다", () => {
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    // The new component shows "Rank {laeguePlayerId}" instead of grade
    expect(screen.getByText(/Rank 1/i)).toBeInTheDocument();
  });

  it("클랜 정보가 표시되어야 한다", () => {
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    // "Ultron Clan"이 UserHeader와 SeasonStats에 2번 나타날 수 있음
    expect(screen.getAllByText(/Ultron Clan/i).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("포인트가 표시되어야 한다", () => {
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/2,850 Points/i)).toBeInTheDocument();
  });

  it("전적 갱신 버튼이 표시되어야 한다", () => {
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    expect(screen.getByRole("button", { name: /전적 갱신/i })).toBeInTheDocument();
  });

  it("하트 버튼이 표시되어야 한다", () => {
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    const heartButton = container.querySelector(".fa-heart");
    expect(heartButton?.parentElement).toBeInTheDocument();
  });

  it("공유 버튼이 표시되어야 한다", () => {
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    const shareButton = container.querySelector(".fa-share-alt");
    expect(shareButton?.parentElement).toBeInTheDocument();
  });

  it("사용자 아바타가 표시되어야 한다", () => {
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    const avatar = container.querySelector(".fa-user");
    expect(avatar).toBeInTheDocument();
  });

  it("사용자 헤더 카드가 표시되어야 한다", () => {
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    const headerCard = container.querySelector(
      ".bg-white.dark\\:bg-brand-800.rounded-xl"
    );
    expect(headerCard).toBeInTheDocument();
  });

  it("전적 갱신 버튼 클릭 시 로딩 상태가 표시되어야 한다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole("button", { name: /전적 갱신/i });
    await user.click(refreshButton);

    expect(screen.getByText(/갱신 중.../i)).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });

  it("갱신 중일 때 버튼이 비활성화되어야 한다", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole("button", { name: /전적 갱신/i });

    // 클릭 직전에는 활성화 상태
    expect(refreshButton).not.toBeDisabled();

    await user.click(refreshButton);

    // 클릭 직후에는 비활성화 상태
    expect(refreshButton).toBeDisabled();
    expect(refreshButton).toHaveClass("disabled:opacity-50");
  });

  it("갱신 중일 때 스피너 아이콘이 회전해야 한다", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);

    const refreshButton = screen.getByRole("button", { name: /전적 갱신/i });
    await user.click(refreshButton);

    // 갱신 중일 때 스피너 아이콘이 나타남
    const spinIcon = container.querySelector(".fa-spin");
    expect(spinIcon).toBeInTheDocument();
    expect(spinIcon).toHaveClass("fa-sync-alt");
  });

  it("다크 모드 스타일이 적용되어야 한다", () => {
    const { container } = renderWithProviders(<UserHeader playerInfo={mockPlayerInfo} />);
    const userInfoCard = container.querySelector(".dark\\:bg-brand-800");
    expect(userInfoCard).toBeInTheDocument();
  });
});
