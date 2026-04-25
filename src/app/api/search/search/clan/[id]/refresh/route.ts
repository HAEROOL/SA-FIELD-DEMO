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
    const clan =
      store.clans.find((c) => c.nexonClanId === id) ??
      store.clans.find((c) => String(c.clanId) === id);
    if (!clan) {
      emit("COOLDOWN", "클랜을 찾을 수 없습니다.");
      return;
    }
    store.touchClan(clan.clanId);
    emit("COMPLETE", "갱신이 완료되었습니다.");
  });
}
