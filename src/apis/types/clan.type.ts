export interface ClanInfo {
  clanId: number;
  clanName: string;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  nexonClanId: string;
  division: number;
  ladderPoints: number;
  seasonWins: number;
  seasonLosses: number;
  seasonDraws: number;
  joinedAt: string;
  rank: number | null;
  updateAt?: string | null;
}

export interface ClanMember {
  playerId: number;
  nexonOuid?: string;
  nickname: string;
  clanRole: string; // "클랜마스터", "부마스터", "운영진", "클랜원"
  totalGradeName: string | null;
  recentWinRate: number;
  recentKdRate: number;
  ladderPoints: number;
  totalWins: number;
  totalLosses: number;
  mvpCount: number;
}

export interface ClanMatchparticipant {
  id: number;
  playerId: number;
  nexonOuId?: string;
  nickname: string;
  teamSide: "RED" | "BLUE";
  teamSideCode: number; // 1: RED, 2: BLUE
  result: "승리" | "패배" | "무승부";
  resultCode: number; // 1: 승리, 0: 패배 (무승부는?) - 데이터 확인 필요, 일단 1/0
  kills: number;
  deaths: number;
  assists: number;
  headshots: number | null;
  damage: number;
  isMvp: boolean;
  isMercenary: boolean | null;
  lpChange: number | null;
  clanName: string | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  weaponType: string | null;
  playerLadderPoint: number | null;
}

export interface ClanMatch {
  matchId: number;
  nexonMatchId: string;
  matchType: string | null;
  matchMode: string | null;
  matchMap: string;
  clanRed: number;
  clanBlue: number;
  clanRedName: string;
  clanBlueName: string;
  clanRedMarkUrl: string | null;
  clanRedBackMarkUrl: string | null;
  clanBlueMarkUrl: string | null;
  clanBlueBackMarkUrl: string | null;
  scoreRed: number;
  scoreBlue: number;
  winnerClanId: number | null; // 무승부일 경우 null일 수 있음
  matchDate: string;
  changePoints: number | null;
  finalPoints: number | null;
  clanRedDivision: number | null;
  clanRedLadderPoint: number | null;
  clanBlueDivision: number | null;
  clanBlueLadderPoint: number | null;
  createAt: string | null;
  participants: ClanMatchparticipant[];
}
