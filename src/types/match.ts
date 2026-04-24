export interface PlayerSummary {
  nickname: string;
  tag: string | null;
  is_self?: boolean;
  // New fields for 5vs5 list
  playerId: number;
  nexonOuId?: string;
  clanName: string | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  is_mvp: boolean;
  role: "S" | "TS" | null;
}

export interface TeamSummary {
  team_name: string;
  league_info: string;
  side: string;
  is_winner: boolean;
  score: number;
  clanId?: number;
  division?: number;
  clanLadderPoint?: number;
  clanMarkUrl?: string | null;
  clanBackMarkUrl?: string | null;
  players: PlayerSummary[];
}

export interface Player {
  nickname: string;
  is_mvp: boolean;
  ladder_status: string;
  points: number;
  kda: {
    kill: number;
    death: number;
    assist: number;
    ratio: number;
  };
  weapon: string;
  weaponType: "RIFLE" | "SNIPER" | null;
  damage: number | null;
  headshot: {
    count: number;
    ratio: number;
  } | null;
  role?: "S" | "TS" | null;
  // Enhanced UI fields
  playerId: number;
  nexonOuId?: string;
  clanName: string | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  is_self?: boolean;
}

export interface Team {
  team_name: string;
  result: "승리" | "패배" | "무승부";
  side: string;
  total_points: number;
  division?: number;
  clanLadderPoint?: number;
  clanMarkUrl?: string | null;
  clanBackMarkUrl?: string | null;
  players: Player[];
}

export interface MatchSummary {
  map_name: string;
  play_time: string;
  result: string;
  timestamp_relative: string;
  match_category: string;
  lpChange: number | null;
}

export interface PersonalStats {
  kda: {
    kills: number;
    deaths: number;
    assists: number;
  };
  kda_ratio: number; // (K + A) / D ratio
}

export interface MatchInfo {
  map_name: string;
  matchType: string;
  start_time: string;
  league_type: string;
}

export interface DetailData {
  match_info: MatchInfo;
  teams: [Team, Team];
}

export interface Match {
  id: number;
  match_summary: MatchSummary;
  personal_stats: PersonalStats;
  teams: [TeamSummary, TeamSummary];
  detailData?: DetailData;
}
