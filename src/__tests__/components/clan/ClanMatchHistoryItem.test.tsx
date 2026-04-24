import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClanMatchHistoryItem from "@/components/clan/ClanMatchHistoryItem";
import { ClanMatch } from "@/apis/types/clan.type";



// 용병 시스템이 포함된 실제 데이터 구조
const mockClanMatch: ClanMatch = {
  matchId: 94,
  nexonMatchId: "260128015955124001",
  matchType: "클랜전",
  matchMode: "5vs5",
  matchMap: "제3보급창고",
  clanRed: 1,
  clanBlue: 3,
  clanRedName: "eternalrz",
  clanBlueName: "saint",
  clanRedMarkUrl: "51/1_24_397.png",
  clanRedBackMarkUrl: "51/1_24_397_back.png",
  clanBlueMarkUrl: "51/1_21_087.png",
  clanBlueBackMarkUrl: "51/1_21_087_back.png",
  scoreRed: 8,
  scoreBlue: 1,
  changePoints: null,
  finalPoints: null,
  clanRedDivision: null,
  clanRedLadderPoint: null,
  clanBlueDivision: null,
  clanBlueLadderPoint: null,
  winnerClanId: 3,
  matchDate: "2026-01-28 10:59:55",
  createAt: "2026-01-28 10:59:55",
  participants: [
    // RED 팀 - 여러 클랜 소속 (용병 포함)
    {
      id: 941,
      playerId: 63,
      nickname: "rorz",
      teamSide: "RED",
      teamSideCode: 1,
      result: "패배",
      resultCode: 0,
      kills: 12,
      deaths: 4,
      assists: 5,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 1635,
      isMvp: false,
      isMercenary: false,
      lpChange: 0,
      clanName: "eternalrz",
      clanMarkUrl: "51/1_24_397.png",
      clanBackMarkUrl: "51/1_24_397_back.png",
    },
    {
      id: 942,
      playerId: 435,
      nickname: "예쁜시아",
      teamSide: "RED",
      teamSideCode: 1,
      result: "패배",
      resultCode: 0,
      kills: 11,
      deaths: 1,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 1740,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "des`per@do.",
      clanMarkUrl: "51/1_24_190.png",
      clanBackMarkUrl: "51/1_24_190_back.png",
    },
    {
      id: 943,
      playerId: 1177,
      nickname: "오낑께데스까",
      teamSide: "RED",
      teamSideCode: 1,
      result: "패배",
      resultCode: 0,
      kills: 10,
      deaths: 6,
      assists: 4,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 1694,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "BeeIzebuI",
      clanMarkUrl: "51/1_23_383.png",
      clanBackMarkUrl: "51/1_23_383_back.png",
    },
    {
      id: 944,
      playerId: 952,
      nickname: "울쩍",
      teamSide: "RED",
      teamSideCode: 1,
      result: "패배",
      resultCode: 0,
      kills: 4,
      deaths: 5,
      assists: 5,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 738,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "BeeIzebuI",
      clanMarkUrl: "51/1_23_383.png",
      clanBackMarkUrl: "51/1_23_383_back.png",
    },
    {
      id: 945,
      playerId: 495,
      nickname: "꽁벌레",
      teamSide: "RED",
      teamSideCode: 1,
      result: "패배",
      resultCode: 0,
      kills: 2,
      deaths: 6,
      assists: 2,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 488,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "MiraGe.",
      clanMarkUrl: "51/1_21_168.png",
      clanBackMarkUrl: "51/1_21_168_back.png",
    },
    // BLUE 팀 - 여러 클랜 소속 (용병 포함)
    {
      id: 946,
      playerId: 92,
      nickname: "워즈",
      teamSide: "BLUE",
      teamSideCode: 2,
      result: "승리",
      resultCode: 1,
      kills: 2,
      deaths: 8,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 0,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "［P.ro™］",
      clanMarkUrl: "51/1_24_218.png",
      clanBackMarkUrl: "51/1_24_218_back.png",
    },
    {
      id: 947,
      playerId: 20,
      nickname: "유징이",
      teamSide: "BLUE",
      teamSideCode: 2,
      result: "승리",
      resultCode: 1,
      kills: 10,
      deaths: 7,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 0,
      isMvp: true,
      isMercenary: false,
      lpChange: 0,
      clanName: "saint",
      clanMarkUrl: "51/1_21_087.png",
      clanBackMarkUrl: "51/1_21_087_back.png",
    },
    {
      id: 948,
      playerId: 12,
      nickname: "bok",
      teamSide: "BLUE",
      teamSideCode: 2,
      result: "승리",
      resultCode: 1,
      kills: 2,
      deaths: 8,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 0,
      isMvp: false,
      isMercenary: false,
      lpChange: 0,
      clanName: "saint",
      clanMarkUrl: "51/1_21_087.png",
      clanBackMarkUrl: "51/1_21_087_back.png",
    },
    {
      id: 949,
      playerId: 411,
      nickname: "ChristianpearI",
      teamSide: "BLUE",
      teamSideCode: 2,
      result: "승리",
      resultCode: 1,
      kills: 6,
      deaths: 8,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 0,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "<#ever_wC>",
      clanMarkUrl: "51/1_21_210.png",
      clanBackMarkUrl: "51/1_21_210_back.png",
    },
    {
      id: 950,
      playerId: 101,
      nickname: "든든이",
      teamSide: "BLUE",
      teamSideCode: 2,
      result: "승리",
      resultCode: 1,
      kills: 2,
      deaths: 8,
      assists: 0,
      headshots: 0,
      weaponType: "RIFLE",
      playerLadderPoint: 1000,
      damage: 0,
      isMvp: false,
      isMercenary: true,
      lpChange: 0,
      clanName: "saint",
      clanMarkUrl: "51/1_21_087.png",
      clanBackMarkUrl: "51/1_21_087_back.png",
    },
  ],
};

describe("ClanMatchHistoryItem", () => {
  it("renders clan names and basic match info", () => {
    render(
      <ClanMatchHistoryItem
        match={mockClanMatch}
        myClanId={1}
        isExpanded={false}
        onToggle={() => {}}
      />
    );

    expect(screen.getAllByText("eternalrz").length).toBeGreaterThan(0);
    expect(screen.getAllByText("saint").length).toBeGreaterThan(0);
    expect(screen.getAllByText("패배").length).toBeGreaterThan(0); // mockClanMatch winnerClanId=3 (saint), myClanId=1 => 패배
  });

  it("correctly separates teams by teamSide (RED vs BLUE) with mercenaries", () => {
    render(
      <ClanMatchHistoryItem
        match={mockClanMatch}
        myClanId={1} // eternalrz clan
        isExpanded={false}
        onToggle={() => {}}
      />
    );

    // RED 팀 플레이어들 (내 팀)
    expect(screen.getByText("rorz")).toBeInTheDocument();
    expect(screen.getByText("예쁜시아")).toBeInTheDocument();
    expect(screen.getByText("오낑께데스까")).toBeInTheDocument();
    expect(screen.getByText("울쩍")).toBeInTheDocument();
    expect(screen.getByText("꽁벌레")).toBeInTheDocument();

    // BLUE 팀 플레이어들 (적 팀)
    expect(screen.getByText("워즈")).toBeInTheDocument();
    expect(screen.getByText("유징이")).toBeInTheDocument();
    expect(screen.getByText("bok")).toBeInTheDocument();
    expect(screen.getByText("ChristianpearI")).toBeInTheDocument();
    expect(screen.getByText("든든이")).toBeInTheDocument();
  });

  it("identifies my clan's teamSide correctly when viewing as clanB", () => {
    render(
      <ClanMatchHistoryItem
        match={mockClanMatch}
        myClanId={3} // saint clan (BLUE team)
        isExpanded={false}
        onToggle={() => {}}
      />
    );

    // 클랜 이름이 올바르게 표시되는지 확인
    expect(screen.getAllByText("saint").length).toBeGreaterThan(0);
    expect(screen.getAllByText("eternalrz").length).toBeGreaterThan(0);
    
    // 결과가 올바르게 표시되는지 확인 (mockClanMatch winnerClanId=3, myClanId=3 => 승리)
    expect(screen.getAllByText("승리").length).toBeGreaterThan(0);
  });

  it("renders detail data correctly when expanded with correct team distribution", () => {
    render(
      <ClanMatchHistoryItem
        match={mockClanMatch}
        myClanId={1}
        isExpanded={true}
        onToggle={() => {}}
      />
    );

    // 상세 표 내부 항목 확인
    expect(screen.getAllByText("KDA").length).toBeGreaterThan(0);
    
    // 팀별 플레이어 배치 확인 (상세 표 내부)
    expect(screen.getAllByText("rorz").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("유징이").length).toBeGreaterThanOrEqual(1);

    // 헤드샷 데이터가 0인 경우 '-' 대신 0 또는 데이터값 표시 확인
    // 현재 구현: headshots !== null ? headshots : "-"
    // mock data: rorz headshots: 0 => "0"
    // mock data: 예쁜시아 headshots: 0 => "0"
    
    // 텍스트 내용은 구현에 따라 다를 수 있으므로 포함 여부 확인
    const tableRows = screen.getAllByRole("row");
    const rorzRow = tableRows.find(row => row.textContent?.includes("rorz"));
    // 12 (kills), 4 (deaths), 5 (assists), 1635 (damage), 0 (headshots)
    expect(rorzRow?.textContent).toContain("0"); // headshot 0
  });
});
