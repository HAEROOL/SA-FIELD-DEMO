import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecentGames from "@/components/user/RecentGames";
import { userService } from "@/apis/userService";
import { PlayerMatch } from "@/apis/types/user.type";

// Mock UserService
vi.mock("@/apis/userService", () => ({
  userService: {
    getPlayerMatches: vi.fn(),
  },
}));

// Mock data (matches PlayerMatch type roughly)
const mockGames = Array(20).fill(null).map((_, i) => ({
  matchId: i,
  nexonMatchId: `nexon-${i}`,
  matchMap: "3rd Supply Base",
  matchDate: new Date().toISOString(),
  clanRedName: "ClanA",
  clanBlueName: "ClanB",
  scoreRed: 8,
  scoreBlue: 1,
  clanRedLadderPoint: 1000,
  clanBlueLadderPoint: 900,
  clanRedDivision: 1,
  clanBlueDivision: 1,
  changePoints: 10,
  winnerClan: 1,
  clanRedMarkUrl: null,
  clanRedBackMarkUrl: null,
  clanBlueMarkUrl: null,
  clanBlueBackMarkUrl: null,
  participants: [
    {
      playerId: 1,
      nickname: "MyNick",
      teamSide: "RED",
      result: i % 3 === 0 ? "승리" : "패배",
      kills: 10,
      deaths: 5,
      assists: 2,
    }
  ],
})) as unknown as PlayerMatch[];

const mockPaginatedResponse = {
  content: mockGames,
  totalPages: 1,
  totalElements: 20,
  last: true,
  first: true,
  numberOfElements: 20,
  size: 20,
  number: 0,
  empty: false,
  pageable: { pageNumber: 0, pageSize: 20, paged: true, unpaged: false, offset: 0, sort: { sorted: false, unsorted: true, empty: true } },
  sort: { sorted: false, unsorted: true, empty: true },
};

describe("RecentGames", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userService.getPlayerMatches).mockResolvedValue(mockPaginatedResponse as never);
  });

  it("최근 20게임 정보 제목이 표시되어야 한다", async () => {
    render(<RecentGames nexonOuid={"1"} />);
    expect(await screen.findByText(/최근 20게임 정보/i)).toBeInTheDocument();
  });

  it("게임 결과 바가 20개 표시되어야 한다", async () => {
    const { container } = render(<RecentGames nexonOuid={"1"} />);
    await waitFor(() => expect(screen.getByText(/최근 20게임 정보/i)).toBeInTheDocument());
    
    // 게임 결과 바만 선택 (h-8 클래스를 가진 컨테이너 내부의 요소)
    const gameBarContainer = container.querySelector(".h-8.flex.gap-1");
    const gameBars = gameBarContainer?.querySelectorAll("div");
    expect(gameBars?.length).toBe(20);
  });
});
