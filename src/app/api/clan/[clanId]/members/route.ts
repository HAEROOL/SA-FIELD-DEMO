import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { membersOf } from "@/mocks/seed";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clanId: string }> }
) {
  const { clanId } = await params;
  const id = Number(clanId);
  const store = getStore();
  const exists = store.clans.some((c) => c.clanId === id);
  if (!exists) return jsonResponse([]);
  return jsonResponse(membersOf(id));
}
