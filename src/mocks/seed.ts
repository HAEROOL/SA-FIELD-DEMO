import type {
  ClanInfo,
  ClanMember,
  ClanMatch,
  ClanMatchparticipant,
} from "@/apis/types/clan.type";
import type {
  PlayerInfo,
  PlayerMatch,
  PlayerMatchParticipant,
} from "@/apis/types/user.type";
import type { LeaguePlayer } from "@/apis/types/league.type";
import type {
  PostResponseDto,
  PostInfoResponseDto,
  CommentResponseDto,
  BoardType,
} from "@/apis/types/post.type";

export interface SeedPlayer {
  playerId: number;
  laeguePlayerId: number;
  nexonOuid: string;
  nickName: string;
  clanId: number | null;
  totalKill: number;
  totalDeath: number;
  totalWin: number;
  totalLose: number;
  mvpCount: number;
  ladderPoint: number;
}

const MAPS = [
  "격전지",
  "제3보급창고",
  "심연",
  "데저트 이글",
  "오피스",
  "히든시티",
  "지하철",
  "파괴된 광장",
];

const WEAPON_TYPES: Array<"RIFLE" | "SNIPER"> = ["RIFLE", "SNIPER"];

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

const isoDate = (daysAgo: number, hour = 20, minute = 0): string => {
  const base = Date.UTC(2026, 3, 24, hour, minute, 0);
  const d = new Date(base - daysAgo * 24 * 60 * 60 * 1000);
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:00`
  );
};

export const SEED_CLANS: ClanInfo[] = [
  { clanId: 101, clanName: "판게아", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-101", division: 1, ladderPoints: 2820, seasonWins: 42, seasonLosses: 11, seasonDraws: 2, joinedAt: "2024-08-10T10:00:00", rank: 1 },
  { clanId: 102, clanName: "블랙팬서", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-102", division: 1, ladderPoints: 2710, seasonWins: 38, seasonLosses: 14, seasonDraws: 1, joinedAt: "2024-08-12T10:00:00", rank: 2 },
  { clanId: 103, clanName: "아레스", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-103", division: 1, ladderPoints: 2620, seasonWins: 35, seasonLosses: 16, seasonDraws: 2, joinedAt: "2024-09-01T10:00:00", rank: 3 },
  { clanId: 104, clanName: "올림푸스", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-104", division: 1, ladderPoints: 2510, seasonWins: 31, seasonLosses: 19, seasonDraws: 0, joinedAt: "2024-09-20T10:00:00", rank: 4 },
  { clanId: 105, clanName: "스파르탄", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-105", division: 1, ladderPoints: 2385, seasonWins: 28, seasonLosses: 22, seasonDraws: 1, joinedAt: "2024-10-02T10:00:00", rank: 5 },
  { clanId: 201, clanName: "피닉스", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-201", division: 2, ladderPoints: 1980, seasonWins: 26, seasonLosses: 18, seasonDraws: 1, joinedAt: "2024-10-15T10:00:00", rank: 6 },
  { clanId: 202, clanName: "드래곤", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-202", division: 2, ladderPoints: 1905, seasonWins: 24, seasonLosses: 20, seasonDraws: 0, joinedAt: "2024-10-22T10:00:00", rank: 7 },
  { clanId: 203, clanName: "타이거스", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-203", division: 2, ladderPoints: 1820, seasonWins: 22, seasonLosses: 23, seasonDraws: 2, joinedAt: "2024-11-05T10:00:00", rank: 8 },
  { clanId: 204, clanName: "울프팩", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-204", division: 2, ladderPoints: 1745, seasonWins: 19, seasonLosses: 24, seasonDraws: 1, joinedAt: "2024-11-18T10:00:00", rank: 9 },
  { clanId: 301, clanName: "루키즈", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-301", division: 3, ladderPoints: 1420, seasonWins: 16, seasonLosses: 20, seasonDraws: 0, joinedAt: "2025-01-03T10:00:00", rank: 10 },
  { clanId: 302, clanName: "샤크", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-302", division: 3, ladderPoints: 1325, seasonWins: 13, seasonLosses: 23, seasonDraws: 1, joinedAt: "2025-02-08T10:00:00", rank: 11 },
  { clanId: 303, clanName: "이글스", clanMarkUrl: null, clanBackMarkUrl: null, nexonClanId: "nxclan-303", division: 3, ladderPoints: 1240, seasonWins: 10, seasonLosses: 26, seasonDraws: 0, joinedAt: "2025-02-20T10:00:00", rank: 12 },
];

const NICK_POOL = [
  "빙하의검", "야생마", "킬매니아", "조준달인", "리코셰", "헤드샷신", "고요한총성", "전설의저격",
  "불꽃돌격", "회오리", "섀도우", "판다", "코발트", "크림슨", "네온", "실버불릿",
  "레전드킬러", "라스트맨", "라이드", "아이언월", "데브", "젠틀맨", "레이디", "로닌",
  "솔저리스트", "리바이어던", "미노타우로스", "오라클", "팔라딘", "베테랑", "파이럿", "플레임",
  "제로", "제이드", "스트라이커", "엑소더스", "하이로우", "화이트팔콘", "레드캣", "옐로우잭",
  "가디언", "라이트닝", "나이트폴", "퀀텀", "레이븐", "샤먼", "타겟락", "토러스",
  "뱅가드", "미사일", "에이스", "폴트", "히든프로", "디펜더", "퀵샷", "라스트샷",
  "판저", "치터베인", "데스데스", "블루라이트", "세이프존", "스카웃", "워치독", "머큐리",
  "파이어버드", "비스트모드", "골든트리거", "메카닉", "올스타", "레거시", "호라이즌", "스카이라인",
  "오메가", "제논", "이카루스", "타이탄로어", "드래곤킹", "피닉스라이즈", "스파르탄300", "아테나",
];

const CLANLESS_NICKS = [
  "방랑자", "무소속의신", "홀로늑대", "데일리샷", "첫사랑총성", "세상의끝", "로밍플레이어", "캐주얼꾼",
  "연습중", "체험판유저", "재미로해요", "노데스", "핵스캔", "야생킹", "카페숙자", "블랙홀",
  "뉴비지옥", "복수심", "은퇴자", "세월의눈",
];

const ouid = (id: number) => `ouid-${String(id).padStart(6, "0")}`;

function buildPlayers(): SeedPlayer[] {
  const players: SeedPlayer[] = [];
  let pid = 1000;
  let lpid = 5000;
  SEED_CLANS.forEach((clan, ci) => {
    const count = 10 + (ci % 4); // 10~13 members
    for (let i = 0; i < count; i++) {
      pid += 1;
      lpid += 1;
      const base = clan.ladderPoints + (count - i) * 8 - 40;
      const wins = clan.seasonWins + (i % 5) * 3;
      const losses = clan.seasonLosses + (i % 4) * 2;
      const kills = 600 + (ci * 30) + i * 17;
      const deaths = 400 + (ci * 20) + i * 11;
      const nickIndex = (ci * 13 + i * 3) % NICK_POOL.length;
      players.push({
        playerId: pid,
        laeguePlayerId: lpid,
        nexonOuid: ouid(pid),
        nickName: `${NICK_POOL[nickIndex]}${i === 0 ? "★" : ""}`,
        clanId: clan.clanId,
        totalKill: kills,
        totalDeath: deaths,
        totalWin: wins,
        totalLose: losses,
        mvpCount: Math.max(0, 15 - i),
        ladderPoint: base,
      });
    }
  });
  // Clanless players
  CLANLESS_NICKS.forEach((nick, i) => {
    pid += 1;
    lpid += 1;
    players.push({
      playerId: pid,
      laeguePlayerId: lpid,
      nexonOuid: ouid(pid),
      nickName: nick,
      clanId: null,
      totalKill: 250 + i * 11,
      totalDeath: 280 + i * 9,
      totalWin: 18 + (i % 5) * 3,
      totalLose: 22 + (i % 4) * 2,
      mvpCount: i % 4,
      ladderPoint: 1100 + i * 7,
    });
  });
  return players;
}

export const SEED_PLAYERS: SeedPlayer[] = buildPlayers();

export const clanOf = (clanId: number | null) =>
  clanId == null ? null : SEED_CLANS.find((c) => c.clanId === clanId) ?? null;

function clanRole(index: number): string {
  if (index === 0) return "클랜마스터";
  if (index === 1) return "부마스터";
  if (index < 4) return "운영진";
  return "클랜원";
}

function totalGradeName(points: number): string | null {
  if (points >= 2500) return "다이아몬드";
  if (points >= 2000) return "플래티넘";
  if (points >= 1500) return "골드";
  if (points >= 1200) return "실버";
  return "브론즈";
}

export function membersOf(clanId: number): ClanMember[] {
  const clanPlayers = SEED_PLAYERS.filter((p) => p.clanId === clanId);
  return clanPlayers.map((p, i) => ({
    playerId: p.playerId,
    nexonOuid: p.nexonOuid,
    nickname: p.nickName,
    clanRole: clanRole(i),
    totalGradeName: totalGradeName(p.ladderPoint),
    recentWinRate: Math.round(((p.totalWin / Math.max(1, p.totalWin + p.totalLose)) * 100) * 10) / 10,
    recentKdRate: Math.round(((p.totalKill / Math.max(1, p.totalDeath)) * 100)) / 100,
    ladderPoints: p.ladderPoint,
    totalWins: p.totalWin,
    totalLosses: p.totalLose,
    mvpCount: p.mvpCount,
  }));
}

function buildParticipants(
  matchId: number,
  redClanId: number,
  blueClanId: number,
  redWon: boolean,
  draw: boolean
): ClanMatchparticipant[] {
  const redClan = clanOf(redClanId);
  const blueClan = clanOf(blueClanId);
  const redPlayers = SEED_PLAYERS.filter((p) => p.clanId === redClanId).slice(0, 5);
  const bluePlayers = SEED_PLAYERS.filter((p) => p.clanId === blueClanId).slice(0, 5);

  const makeParticipant = (
    player: SeedPlayer,
    side: "RED" | "BLUE",
    localIndex: number
  ): ClanMatchparticipant => {
    const isWinnerSide = draw ? false : side === "RED" ? redWon : !redWon;
    const result: "승리" | "패배" | "무승부" = draw
      ? "무승부"
      : isWinnerSide
      ? "승리"
      : "패배";
    const resultCode = draw ? 2 : isWinnerSide ? 1 : 0;
    const kills = 14 + (localIndex * 3) + (isWinnerSide ? 4 : 0);
    const deaths = 10 + (localIndex * 2) + (isWinnerSide ? -1 : 3);
    const assists = 3 + (localIndex % 3);
    const clan = side === "RED" ? redClan : blueClan;
    const lpDelta = draw ? 0 : isWinnerSide ? 12 : -10;
    return {
      id: matchId * 100 + (side === "RED" ? 0 : 5) + localIndex,
      playerId: player.playerId,
      nexonOuId: player.nexonOuid,
      nickname: player.nickName,
      teamSide: side,
      teamSideCode: side === "RED" ? 1 : 2,
      result,
      resultCode,
      kills,
      deaths: Math.max(1, deaths),
      assists,
      headshots: localIndex % 2 === 0 ? Math.round(kills * 0.3) : null,
      damage: kills * 120 + localIndex * 50,
      isMvp: localIndex === 0 && isWinnerSide,
      isMercenary: false,
      lpChange: lpDelta,
      clanName: clan?.clanName ?? null,
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      weaponType: WEAPON_TYPES[localIndex % 2],
      playerLadderPoint: player.ladderPoint + lpDelta,
    };
  };

  const participants: ClanMatchparticipant[] = [];
  redPlayers.forEach((p, i) => participants.push(makeParticipant(p, "RED", i)));
  bluePlayers.forEach((p, i) => participants.push(makeParticipant(p, "BLUE", i)));
  return participants;
}

function scheduleOpponent(clanIndex: number, matchIndex: number): number {
  // Rotate opponents within same division primarily, with cross-division occasionally
  const clan = SEED_CLANS[clanIndex];
  const sameDivision = SEED_CLANS.filter(
    (c, idx) => idx !== clanIndex && c.division === clan.division
  );
  if (sameDivision.length === 0) return SEED_CLANS[(clanIndex + 1) % SEED_CLANS.length].clanId;
  const opp = sameDivision[matchIndex % sameDivision.length];
  return opp.clanId;
}

export function matchesForClan(clanId: number): ClanMatch[] {
  const clanIdx = SEED_CLANS.findIndex((c) => c.clanId === clanId);
  if (clanIdx < 0) return [];
  const clan = SEED_CLANS[clanIdx];
  const results: ClanMatch[] = [];
  const matchCount = 18;
  for (let i = 0; i < matchCount; i++) {
    const matchId = clan.clanId * 1000 + i + 1;
    const oppId = scheduleOpponent(clanIdx, i);
    const opp = clanOf(oppId)!;
    const draw = i % 9 === 0 && i > 0;
    const weAreRed = i % 2 === 0;
    const redClanId = weAreRed ? clan.clanId : opp.clanId;
    const blueClanId = weAreRed ? opp.clanId : clan.clanId;
    const weWon = !draw && i % 3 !== 2; // ~66% win rate (skewed for flagship clans)
    const redWon = weAreRed ? weWon : !weWon;
    const scoreRed = draw ? 6 : redWon ? 7 : 3 + (i % 3);
    const scoreBlue = draw ? 6 : redWon ? 3 + (i % 3) : 7;
    const matchDate = isoDate(i * 3 + clanIdx);
    const participants = buildParticipants(
      matchId,
      redClanId,
      blueClanId,
      redWon,
      draw
    );
    results.push({
      matchId,
      nexonMatchId: `nxmatch-${matchId}`,
      matchType: "CLAN_BATTLE",
      matchMode: "CLAN_5v5",
      matchMap: MAPS[i % MAPS.length],
      clanRed: redClanId,
      clanBlue: blueClanId,
      clanRedName: clanOf(redClanId)!.clanName,
      clanBlueName: clanOf(blueClanId)!.clanName,
      clanRedMarkUrl: null,
      clanRedBackMarkUrl: null,
      clanBlueMarkUrl: null,
      clanBlueBackMarkUrl: null,
      scoreRed,
      scoreBlue,
      winnerClanId: draw ? null : redWon ? redClanId : blueClanId,
      matchDate,
      changePoints: draw ? 0 : 12,
      finalPoints: clan.ladderPoints,
      clanRedDivision: clanOf(redClanId)!.division,
      clanRedLadderPoint: clanOf(redClanId)!.ladderPoints,
      clanBlueDivision: clanOf(blueClanId)!.division,
      clanBlueLadderPoint: clanOf(blueClanId)!.ladderPoints,
      createAt: matchDate,
      participants,
    });
  }
  return results;
}

export function playerMatches(playerId: number): PlayerMatch[] {
  const player = SEED_PLAYERS.find((p) => p.playerId === playerId);
  if (!player || player.clanId == null) return [];
  const base = matchesForClan(player.clanId);
  return base.map((cm) => {
    const participants: PlayerMatchParticipant[] = cm.participants.map((p) => ({
      id: p.id,
      playerId: p.playerId,
      nickname: p.nickname,
      teamSide: p.teamSide,
      teamSideCode: p.teamSideCode,
      result: p.result,
      resultCode: p.resultCode,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      headshots: p.headshots ?? 0,
      damage: p.damage,
      isMvp: p.isMvp,
      isMercenary: p.isMercenary ?? false,
      lpChange: p.lpChange ?? 0,
      clanName: p.clanName,
      clanMarkUrl: p.clanMarkUrl,
      clanBackMarkUrl: p.clanBackMarkUrl,
      playerLadderPoint: p.playerLadderPoint ?? 0,
      weaponType: p.weaponType as "RIFLE" | "SNIPER" | null,
      nexonOuId: p.nexonOuId ?? "",
    }));
    return {
      matchId: cm.matchId,
      nexonMatchId: cm.nexonMatchId,
      matchMap: cm.matchMap,
      matchDate: cm.matchDate,
      clanRedId: cm.clanRed,
      clanRedName: cm.clanRedName,
      clanBlueId: cm.clanBlue,
      clanBlueName: cm.clanBlueName,
      scoreRed: cm.scoreRed,
      scoreBlue: cm.scoreBlue,
      clanRedLadderPoint: cm.clanRedLadderPoint ?? 0,
      clanBlueLadderPoint: cm.clanBlueLadderPoint ?? 0,
      clanRedDivision: cm.clanRedDivision ?? 1,
      clanBlueDivision: cm.clanBlueDivision ?? 1,
      changePoints: cm.changePoints ?? 0,
      winnerClan: cm.winnerClanId ?? 0,
      clanRedMarkUrl: cm.clanRedMarkUrl,
      clanRedBackMarkUrl: cm.clanRedBackMarkUrl,
      clanBlueMarkUrl: cm.clanBlueMarkUrl,
      clanBlueBackMarkUrl: cm.clanBlueBackMarkUrl,
      participants,
    };
  });
}

export function toPlayerInfo(p: SeedPlayer): PlayerInfo {
  const clan = clanOf(p.clanId ?? null);
  return {
    laeguePlayerId: p.laeguePlayerId,
    playerId: p.playerId,
    nexonOuid: p.nexonOuid,
    nickName: p.nickName,
    clanId: clan ? String(clan.clanId) : null,
    clanMarkUrl: null,
    clanBackMarkUrl: null,
    clanName: clan?.clanName ?? null,
    totalKill: p.totalKill,
    totalDeath: p.totalDeath,
    totalWin: p.totalWin,
    totalLose: p.totalLose,
    mvpCount: p.mvpCount,
    ladderPoint: p.ladderPoint,
  };
}

export function toLeaguePlayer(p: SeedPlayer): LeaguePlayer {
  const clan = clanOf(p.clanId ?? null);
  return {
    laeguePlayerId: p.laeguePlayerId,
    playerId: p.playerId,
    nickName: p.nickName,
    clanId: clan ? clan.clanId : null,
    clanMarkUrl: null,
    clanBackMarkUrl: null,
    clanName: clan?.clanName ?? null,
    totalKill: p.totalKill,
    totalDeath: p.totalDeath,
    totalWin: p.totalWin,
    totalLose: p.totalLose,
    mvpCount: p.mvpCount,
    ladderPoint: p.ladderPoint,
    nexonOuid: p.nexonOuid,
  };
}

// ---------- Posts ----------

export type BoardKind = BoardType;

export const BOARD_META: Record<BoardKind, { code: number; desc: string }> = {
  NOTICE: { code: 1, desc: "공지사항" },
  FREE: { code: 2, desc: "자유게시판" },
  STRATEGY: { code: 3, desc: "공략" },
  THIRD_DIVISION: { code: 4, desc: "3부 게시판" },
  A_SUPPLY: { code: 5, desc: "A보급" },
  RANKED: { code: 6, desc: "랭크" },
  DAERUL: { code: 7, desc: "대회/대회룰" },
  BROADCAST: { code: 8, desc: "방송" },
};

const POST_TITLES: Record<BoardKind, string[]> = {
  NOTICE: [
    "[안내] SA.FIELD 데모 모드 서비스 오픈",
    "[필독] 매너 규칙 및 신고 가이드",
    "[공지] 4월 서버 점검 일정",
  ],
  FREE: [
    "어제 판게아 vs 블랙팬서 보신 분?",
    "초보 클랜 추천 좀 해주세요",
    "랭크 매칭 진짜 너무 오래 걸립니다",
    "저격수 키보드 추천 부탁드립니다",
    "요즘 자주 쓰는 조준점 셋팅 공유",
    "내일 출근 전에 한 판?",
    "뉴맵 데저트 이글 감상평",
    "프리시즌 클랜 모집합니다 (3부)",
    "상대 팀이 맞팀 같은데 뭐가 문제일까요",
    "혹시 저랑 듀오 가능하신 분",
  ],
  STRATEGY: [
    "[데저트 이글] 초반 운영 3가지 패턴",
    "에임 훈련 루틴 공유 (15분)",
    "AUG 전용 크로스헤어 설정",
    "수류탄 타이밍 정리 - 오피스 편",
    "5v5 대인전 포지션별 역할",
    "저격수 진입 타이밍 맞추는 법",
    "무빙 샷 정확도 올리는 팁",
  ],
  THIRD_DIVISION: [
    "3부 승격전 준비 팁",
    "3부리그 클랜 순위 예측",
    "3부 멤버 구함 - 내일 평가전",
  ],
  A_SUPPLY: [
    "A보급 이벤트 정보 모음",
    "오늘 A보급 보상 업데이트",
    "A보급 최적 루트 영상",
  ],
  RANKED: [
    "이번 시즌 배치 진행 방식",
    "랭크 점수 계산 공식 정리",
    "시즌 종료 보상 안내",
    "솔랭 vs 듀오랭 차이",
  ],
  DAERUL: [
    "다가오는 대회 일정",
    "대회 규정 변경 요약",
  ],
  BROADCAST: [
    "오늘 밤 스트림 예정",
    "클랜전 하이라이트 업로드",
    "새 채널 구독 부탁드립니다",
  ],
};

const AUTHOR_NAMES = ["판게아매니저", "일반시청자", "야생마", "데일리샷", "SA관계자", "라이트닝", "호라이즌"];

function buildPosts(): {
  list: PostResponseDto[];
  info: Map<number, PostInfoResponseDto>;
} {
  const list: PostResponseDto[] = [];
  const info = new Map<number, PostInfoResponseDto>();
  let postId = 5000;
  let commentId = 9000;
  const boardTypes = Object.keys(BOARD_META) as BoardKind[];
  boardTypes.forEach((board, bi) => {
    const titles = POST_TITLES[board] ?? [];
    titles.forEach((title, ti) => {
      postId += 1;
      const meta = BOARD_META[board];
      const likeCount = 15 + ((bi + ti) * 3) % 40;
      const dislikeCount = ((bi + ti) * 2) % 6;
      const authorName = AUTHOR_NAMES[(bi + ti) % AUTHOR_NAMES.length];
      const createdAt = isoDate(bi * 3 + ti, 10 + (ti % 6), (ti * 7) % 60);
      const commentCount = (bi * 2 + ti) % 5;
      const comments: CommentResponseDto[] = [];
      for (let c = 0; c < commentCount; c++) {
        commentId += 1;
        const hasReply = c === 0 && commentCount > 2;
        const children: CommentResponseDto[] = [];
        if (hasReply) {
          commentId += 1;
          children.push({
            commentId,
            content: "저도 동의합니다. 좋은 정리 감사합니다!",
            authorName: AUTHOR_NAMES[(c + 2) % AUTHOR_NAMES.length],
            createdAt: isoDate(bi * 3 + ti - 1, 14 + c, 0),
            isUpdated: false,
            parentId: commentId - 1,
          });
        }
        comments.push({
          commentId: commentId - (hasReply ? 1 : 0),
          content: `의견 ${c + 1}: 정말 참고 많이 되네요.`,
          authorName: AUTHOR_NAMES[(bi + ti + c) % AUTHOR_NAMES.length],
          createdAt: isoDate(bi * 3 + ti - 1, 12 + c, c * 5),
          isUpdated: c === 0,
          parentId: null,
          children,
        });
      }
      const dto: PostResponseDto = {
        postId,
        title,
        authorName,
        viewCount: 120 + postId % 300,
        boardDesc: meta.desc,
        likeCount,
        dislikeCount,
        createdAt,
        commentCnt: comments.length,
        hasImg: ti % 4 === 0,
      };
      const detail: PostInfoResponseDto = {
        ...dto,
        content: `<p><strong>${title}</strong></p><p>SA.FIELD 데모 모드로 구성된 예시 본문입니다. 실제 백엔드 없이 동작하며 세션 동안 변경 사항이 유지됩니다.</p><p>본문 예시 ${ti + 1} — ${meta.desc} 카테고리.</p>`,
        myVote: null,
        images: dto.hasImg
          ? [
              {
                accessUrl: "/images/clan-fallback.png",
                saveFileName: `demo-${postId}.png`,
                originalFileName: "demo.png",
              },
            ]
          : [],
        comments,
      };
      list.push(dto);
      info.set(postId, detail);
    });
  });
  return { list, info };
}

export const SEED_POSTS = buildPosts();
