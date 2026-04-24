export interface PlayerInfo {
  laeguePlayerId: number;
  playerId: number;
  nexonOuid: string;
  nickName: string;
  clanId: string | number | null; // API doc shows string in response example "3", likely number or string
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  clanName: string | null;

  totalKill: number;
  totalDeath: number;
  totalWin: number;
  totalLose: number;
  mvpCount: number;
  ladderPoint: number;
  updateAt?: string | null;
}

export interface PlayerSearchResponse {
  laeguePlayerId: number | null;
  playerId: number | null;
  nexonOuid: string | null;
  nickName: string | null;
  clanId: string | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  clanName: string | null;

  totalKill: number | null;
  totalDeath: number | null;
  totalWin: number | null;
  totalLose: number | null;
  mvpCount: number | null;
  ladderPoint: number | null;
}

export interface PlayerMatchParticipant {
  id: number;
  playerId: number;
  nickname: string;
  teamSide: string; // "RED" | "BLUE"
  teamSideCode: number;
  result: string; // "승리" | "패배"
  resultCode: number;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  damage: number;
  isMvp: boolean;
  isMercenary: boolean;
  lpChange: number;
  clanName: string | null;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  playerLadderPoint: number;
  weaponType: "RIFLE" | "SNIPER" | null;
  nexonOuId: string;
}

export interface PlayerMatch {
  matchId: number;
  nexonMatchId: string;
  matchMap: string;
  matchDate: string;
  clanRedId: number;
  clanRedName: string;
  clanBlueId: number;
  clanBlueName: string;
  scoreRed: number;
  scoreBlue: number;
  clanRedLadderPoint: number;
  clanBlueLadderPoint: number;
  clanRedDivision: number;
  clanBlueDivision: number;
  changePoints: number;
  winnerClan: number;
  clanRedMarkUrl: string | null;
  clanRedBackMarkUrl: string | null;
  clanBlueMarkUrl: string | null;
  clanBlueBackMarkUrl: string | null;
  participants: PlayerMatchParticipant[];
}

export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}
