import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClanMembers from "@/components/clan/ClanMembers";
import { clanService } from "@/apis/clanService";
import { ClanMember } from "@/apis/types/clan.type";

// Mock data
const mockMembers: ClanMember[] = [
  {
    playerId: 1,
    nickname: "sa_king☆",
    clanRole: "MASTER",
    ladderPoints: 2850,
    totalWins: 94,
    totalLosses: 62,
    totalGradeName: "Commander",
    recentWinRate: 60.2,
    recentKdRate: 55.5,
    mvpCount: 10,
  },
  {
    playerId: 2,
    nickname: "SniperPro",
    clanRole: "MEMBER",
    ladderPoints: 2100,
    totalWins: 80,
    totalLosses: 60,
    totalGradeName: "Major",
    recentWinRate: 57.1,
    recentKdRate: 52.0,
    mvpCount: 5,
  },
  {
    playerId: 3,
    nickname: "Ghost",
    clanRole: "MEMBER",
    ladderPoints: 1950,
    totalWins: 45,
    totalLosses: 35,
    totalGradeName: "Captain",
    recentWinRate: 56.2,
    recentKdRate: 50.0,
    mvpCount: 8,
  },
  {
    playerId: 4,
    nickname: "Newbie1",
    clanRole: "MEMBER",
    ladderPoints: 1200,
    totalWins: 10,
    totalLosses: 10,
    totalGradeName: "Private",
    recentWinRate: 50.0,
    recentKdRate: 45.0,
    mvpCount: 1,
  },
];

// Mock service
vi.mock("@/apis/clanService", () => ({
  clanService: {
    getClanMembers: vi.fn(),
  },
}));

describe("ClanMembers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(clanService.getClanMembers).mockResolvedValue(mockMembers);
  });

  it("renders member list mock data", async () => {
    render(<ClanMembers clanId={1} />);

    expect(await screen.findByText("클랜원 목록")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("sa_king☆")).toBeInTheDocument();
      expect(screen.getByText("SniperPro")).toBeInTheDocument();
    });
  });

  it("filters members by search query", async () => {
    render(<ClanMembers clanId={1} />);

    await waitFor(() => screen.findByText("sa_king☆"));

    const searchInput = screen.getByPlaceholderText("클랜원 검색");
    fireEvent.change(searchInput, { target: { value: "Sniper" } });

    expect(screen.getByText("SniperPro")).toBeInTheDocument();
    expect(screen.queryByText("sa_king☆")).not.toBeInTheDocument();
  });

  it("sorts members correctly", async () => {
    render(<ClanMembers clanId={1} />);

    await waitFor(() => screen.findByText("sa_king☆"));

    // Default sort by ladder (sa_king☆ 2850 vs Newbie1 1200)
    // Finding rows - row 0 is header
    const rows = screen.getAllByRole("row");
    // Row 1 (index 1) should be sa_king (ladder 2850)
    expect(rows[1]).toHaveTextContent("sa_king☆");

    // Click on Matches header to sort by Matches
    const matchesHeader = screen.getByText(/경기 수/);
    fireEvent.click(matchesHeader);

    // sa_king (156 games) vs SniperPro (140 games). sa_king first.
    // Let's ensure Newbie1 (20 games) is last.
    const sortedRows = screen.getAllByRole("row");
    expect(sortedRows[1]).toHaveTextContent("sa_king☆");
    expect(sortedRows[sortedRows.length - 1]).toHaveTextContent("Newbie1");

    // Verify sorting by Win Rate
    const winRateHeader = screen.getByText(/승률/);
    fireEvent.click(winRateHeader);
    
    // sa_king: 94/156 = 60.2%
    // SniperPro: 80/140 = 57.1%
    // Ghost: 45/80 = 56.2%
    // Newbie1: 10/20 = 50.0%
    // Order: sa_king, SniperPro, Ghost, Newbie1
    
    const winRateRows = screen.getAllByRole("row");
    expect(winRateRows[1]).toHaveTextContent("sa_king☆");
  });
});
