import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const division = (searchParams.get("division") ?? "").trim();
  const store = getStore();
  let filtered = [...store.clans];
  if (division) {
    const num = Number(division);
    if (Number.isFinite(num)) {
      filtered = filtered.filter((c) => c.division === num);
    }
  }
  const sorted = filtered
    .sort((a, b) => b.ladderPoints - a.ladderPoints)
    .map((c) => {
      const total = (c.seasonWins ?? 0) + (c.seasonLosses ?? 0);
      const winRate = total > 0 ? Math.round(((c.seasonWins ?? 0) / total) * 1000) / 10 : 0;
      return {
        clanId: c.clanId,
        clanName: c.clanName,
        clanMarkUrl: c.clanMarkUrl,
        clanBackMarkUrl: c.clanBackMarkUrl,
        nexonClanId: c.nexonClanId,
        division: c.division,
        ladderPoints: c.ladderPoints,
        seasonWins: c.seasonWins,
        seasonLosses: c.seasonLosses,
        seasonDraws: c.seasonDraws,
        winRate,
      };
    });
  return jsonResponse(sorted);
}
