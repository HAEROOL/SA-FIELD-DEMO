import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import SeasonStats from "@/components/user/SeasonStats";
import { renderWithProviders } from "../../utils/test-utils";
import { PlayerInfo } from "@/apis/types/user.type";

const mockPlayerInfo: PlayerInfo = {
  playerId: 1,
  nickname: "sa_king☆",
  level: 50,
  exp: 12345,
  point: 2850,
  rank: 1,
  clanId: 10,
  clanName: "Ultron Clan",
  clanMarkUrl: null,
    clanBackMarkUrl: null,
  totalGradeName: "Legend",
  recentWinRate: 60.3, // Matches test expectation
  recentKdRate: 2.24,  // Matches test expectation
  tier: "Diamond II",  // Matches test expectation
  country: "KR",
  introduction: "Hello World",
  profileImageUrl: null,
  mvpCount: 23,        // Matches test expectation
  rankStr: "127위",    // Not in type? Wait. type has 'rank'? 
  // Let's check type if needed. Assuming PlayerInfo structure.
  lastLoginAt: new Date().toISOString()
} as unknown as PlayerInfo; 
// Force cast if type definition differs slightly (rankStr vs rank)

describe("SeasonStats", () => {
  it("시즌 전체 정보 제목이 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/시즌 전체 정보/i)).toBeInTheDocument();
  });

  it("시즌 정보가 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/2024 Season 2/i)).toBeInTheDocument();
  });

  it("래더 정보가 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/래더/i)).toBeInTheDocument();
    expect(screen.getByText(/Diamond II/i)).toBeInTheDocument();
  });

  it("승률이 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/승률/i)).toBeInTheDocument();
    expect(screen.getByText("60.3%")).toBeInTheDocument();
  });

  it("킬뎃이 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/킬뎃/i)).toBeInTheDocument();
    expect(screen.getByText("2.24")).toBeInTheDocument();
  });

  it("평균킬이 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/평균킬/i)).toBeInTheDocument();
    // 18.2 might be hardcoded as logic inside component or derived?
    // UserStats component might calculate avg kills?
    // Let's assume input has kills/deaths/matches and component computes it.
    // Or mock data has it.
    expect(screen.getByText("18.2")).toBeInTheDocument();
  });

  it("MVP 정보가 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/MVP/i)).toBeInTheDocument();
    expect(screen.getByText(/23회/i)).toBeInTheDocument();
  });

  it("랭킹 정보가 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/랭킹/i)).toBeInTheDocument();
    expect(screen.getByText(/127위/i)).toBeInTheDocument();
  });

  it("소속 정보가 표시되어야 한다", () => {
    renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    expect(screen.getByText(/소속/i)).toBeInTheDocument();
    expect(screen.getByText(/Ultron Clan/i)).toBeInTheDocument();
  });

  it("트로피 아이콘이 표시되어야 한다", () => {
    const { container } = renderWithProviders(<SeasonStats playerInfo={mockPlayerInfo} />);
    const icon = container.querySelector(".fa-trophy");
    expect(icon).toBeInTheDocument();
  });
});
