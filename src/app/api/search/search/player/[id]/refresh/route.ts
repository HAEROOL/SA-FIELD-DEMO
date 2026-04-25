import { sseStream } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return sseStream(async (emit) => {
    emit("connect", "connected");
    await new Promise((r) => setTimeout(r, 1200));
    const store = getStore();
    const player =
      store.players.find((p) => p.nexonOuid === id) ??
      store.players.find((p) => String(p.playerId) === id);
    if (!player) {
      emit("COOLDOWN", "플레이어를 찾을 수 없습니다.");
      return;
    }
    store.touchPlayer(player.playerId);
    emit("COMPLETE", "갱신이 완료되었습니다.");
  });
}
