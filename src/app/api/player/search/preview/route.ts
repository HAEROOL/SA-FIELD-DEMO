import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { clanOf } from "@/mocks/seed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = (searchParams.get("keyword") ?? "").trim();
  if (!keyword) return jsonResponse([]);
  const lower = keyword.toLowerCase();
  const store = getStore();
  const matches = store.players
    .filter((p) => p.nickName.toLowerCase().includes(lower))
    .slice(0, 8)
    .map((p) => {
      const clan = clanOf(p.clanId);
      return {
        playerId: p.playerId,
        nexonOuid: p.nexonOuid,
        nickName: p.nickName,
        clanName: clan?.clanName ?? null,
        clanMarkUrl: null,
        clanBackMarkUrl: null,
      };
    });
  return jsonResponse(matches);
}
