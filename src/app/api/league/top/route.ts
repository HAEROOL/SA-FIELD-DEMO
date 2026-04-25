import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import type { LeagueTopResponse } from "@/apis/types/league.type";

export async function GET() {
  const store = getStore();
  const byDivision: LeagueTopResponse["topRankings"] = {};
  [1, 2, 3].forEach((division) => {
    const list = store.clans
      .filter((c) => c.division === division)
      .sort((a, b) => b.ladderPoints - a.ladderPoints)
      .slice(0, 10)
      .map((c) => {
        const total = (c.seasonWins ?? 0) + (c.seasonLosses ?? 0);
        const winRate = total > 0 ? Math.round(((c.seasonWins ?? 0) / total) * 1000) / 10 : 0;
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
  return jsonResponse({ topRankings: byDivision });
}
