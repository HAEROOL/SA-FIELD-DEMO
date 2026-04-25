import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { toPlayerInfo } from "@/mocks/seed";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ouid: string }> }
) {
  const { ouid } = await params;
  const store = getStore();
  const player =
    store.players.find((p) => p.nexonOuid === ouid) ??
    store.players.find((p) => String(p.playerId) === ouid);
  if (!player) {
    return jsonResponse(
      { code: "PLAYER_NOT_FOUND", message: "플레이어를 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  const info = toPlayerInfo(player);
  const updateAt = store.playerRefreshedAt.get(player.playerId) ?? null;
  return jsonResponse({ ...info, updateAt });
}
