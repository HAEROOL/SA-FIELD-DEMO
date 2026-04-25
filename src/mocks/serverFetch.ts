import { getStore } from "./store";
import { toPlayerInfo, toLeaguePlayer } from "./seed";
import { toPostPage } from "./helpers";
import type { ClanInfo } from "@/apis/types/clan.type";
import type { PlayerInfo } from "@/apis/types/user.type";
import type { LeagueTopResponse } from "@/apis/types/league.type";
import type { BoardListResponseDto } from "@/apis/types/post.type";

/**
 * Server-only mirror of the API services. Server Components call these directly
 * to skip the self-loopback HTTP hop, so pages can be statically generated or
 * dynamically rendered without requiring a running Next.js server at build time.
 *
 * Client components keep using axios → /api/** route handlers, which read from
 * the same {@link getStore} instance. There is one source of truth.
 */

export async function getTopRankings(): Promise<LeagueTopResponse> {
  const store = getStore();
  const byDivision: LeagueTopResponse["topRankings"] = {};
  [1, 2, 3].forEach((division) => {
    const list = store.clans
      .filter((c) => c.division === division)
      .sort((a, b) => b.ladderPoints - a.ladderPoints)
      .slice(0, 10)
      .map((c) => {
        const total = (c.seasonWins ?? 0) + (c.seasonLosses ?? 0);
        const winRate =
          total > 0 ? Math.round(((c.seasonWins ?? 0) / total) * 1000) / 10 : 0;
        return {
          clanId: c.clanId,
          clanName: c.clanName,
          ladderPoints: c.ladderPoints,
          clanMarkUrl: c.clanMarkUrl,
          clanBackMarkUrl: c.clanBackMarkUrl,
          seasonWins: c.seasonWins ?? 0,
          seasonLosses: c.seasonLosses ?? 0,
          winRate,
        };
      });
    byDivision[String(division)] = list;
  });
  return { topRankings: byDivision };
}

export async function getTrendingPosts(
  page = 0,
  size = 10
): Promise<BoardListResponseDto> {
  const store = getStore();
  const popular = store.listPopular();
  const notices = store.listNotices();
  return {
    notices: toPostPage(notices, 0, Math.max(size, notices.length || size)),
    posts: toPostPage(popular, page, size),
  };
}

export async function getClanInfo(clanId: number | string): Promise<ClanInfo | null> {
  const store = getStore();
  const id = typeof clanId === "number" ? clanId : Number(clanId);
  return store.clans.find((c) => c.clanId === id) ?? null;
}

export async function getPlayerInfo(ouid: string): Promise<PlayerInfo | null> {
  const store = getStore();
  const player =
    store.players.find((p) => p.nexonOuid === ouid) ??
    store.players.find((p) => String(p.playerId) === ouid);
  if (!player) return null;
  const info = toPlayerInfo(player);
  const updateAt = store.playerRefreshedAt.get(player.playerId) ?? null;
  return { ...info, updateAt };
}

// Re-export so `useLeagueRankings` style callers can keep importing from one place.
export { toLeaguePlayer };
