/**
 * 리그 관련 타입 정의
 */

/**
 * 클랜 랭킹 데이터
 */
export interface ClanRanking {
  /** 등수 */
  rank: number;
  /** 클랜 ID (URL 라우팅용) */
  id: string;
  /** 클랜명 */
  name: string;
  /** 클랜 마크 이미지 URL */
  logo: string;
  /** 승리 횟수 */
  wins: number;
  /** 패배 횟수 */
  losses: number;
  /** 승률 (%) */
  winRate: number;
  /** 래더 점수 */
  points: number;
  /** 소속 부 (1, 2, 3, rookies) */
  division: string;
}

/**
 * 플레이어 랭킹 데이터
 */
export interface PlayerRanking {
  /** 등수 */
  rank: number;
  /** 플레이어 ID (URL 라우팅용) */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 소속 클랜 정보 (무소속일 경우 null) */
  clan: {
    /** 클랜 ID */
    id: string;
    /** 클랜명 */
    name: string;
    /** 클랜 마크 이미지 URL */
    logo: string;
  } | null;
  /** 승리 횟수 */
  wins: number;
  /** 패배 횟수 */
  losses: number;
  /** 승률 (%) */
  winRate: number;
  /** K/D 비율 (%) */
  kd: number;
  /** 래더 점수 */
  points: number;
  /** 소속 부 (1, 2, 3, rookies) */
  division: string;
}

/**
 * 정렬 옵션
 */
export type SortOption = 'rank' | 'winRate' | 'points';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 랭킹 타입
 */
export type RankingType = 'clan' | 'player';

/**
 * 리그 부
 */
export type Division = '1' | '2' | '3' | 'rookies';
