import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { clanOf } from "@/mocks/seed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nickname = (searchParams.get("nickname") ?? "").trim();
  const store = getStore();
  const player = store.players.find(
    (p) => p.nickName.toLowerCase() === nickname.toLowerCase()
  );
  if (!player) {
    return jsonResponse({
      laeguePlayerId: null,
      playerId: null,
      nexon_ouid: null,
      nexonOuid: null,
      nickName: null,
      clanId: null,
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      clanName: null,
      totalKill: null,
      totalDeath: null,
      totalWin: null,
      totalLose: null,
      mvpCount: null,
      ladderPoint: null,
    });
  }
  const clan = clanOf(player.clanId);
  return jsonResponse({
    laeguePlayerId: player.laeguePlayerId,
    playerId: player.playerId,
    // Service expects nexon_ouid → converts to nexonOuid. Support both for safety.
    nexon_ouid: player.nexonOuid,
    nexonOuid: player.nexonOuid,
    nickName: player.nickName,
    clanId: clan ? String(clan.clanId) : null,
    clanMarkUrl: null,
    clanBackMarkUrl: null,
    clanName: clan?.clanName ?? null,
    totalKill: player.totalKill,
    totalDeath: player.totalDeath,
    totalWin: player.totalWin,
    totalLose: player.totalLose,
    mvpCount: player.mvpCount,
    ladderPoint: player.ladderPoint,
  });
}
