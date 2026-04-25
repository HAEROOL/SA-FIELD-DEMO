import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clanId: string }> }
) {
  const { clanId } = await params;
  const id = Number(clanId);
  const store = getStore();
  const clan = store.clans.find((c) => c.clanId === id);
  if (!clan) {
    return jsonResponse(
      { code: "CLAN_NOT_FOUND", message: "클랜을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  return jsonResponse(clan);
}
