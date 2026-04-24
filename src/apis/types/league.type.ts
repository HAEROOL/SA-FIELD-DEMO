export interface LeagueClan {
  clanId: number;
  clanName: string;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  nexonClanId: string;
  division: number;
  ladderPoints: number;
  seasonWins?: number;
  seasonLosses?: number;
  seasonDraws?: number;
  winRate?: number; // Optional, derived or from API
}

export interface LeaguePlayer {
  laeguePlayerId: number;
  playerId: number;
  nickName: string;
  clanId: number | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  clanName: string | null;
  totalKill: number;
  totalDeath: number;
  totalWin: number;
  totalLose: number;
  mvpCount: number;
  ladderPoint: number;
  nexonOuid: string;
}

export interface LeagueTopResponse {
  topRankings: {
    [key: string]: {
      clanId: number;
      clanName: string;
      ladderPoints: number;
      clanMarkUrl: string | null;
      clanBackMarkUrl: string | null;
      seasonWins?: number;
      seasonLosses?: number;
      winRate?: number;
    }[]; // key is division "1", "2", "3"
  };
}
