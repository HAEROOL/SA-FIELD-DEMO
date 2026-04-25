import { jsonResponse, paginate, parseInt0 } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { matchesForClan } from "@/mocks/seed";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ clanId: string }> }
) {
  const { clanId } = await params;
  const id = Number(clanId);
  const store = getStore();
  if (!store.clans.some((c) => c.clanId === id)) return jsonResponse([]);
  const { searchParams } = new URL(req.url);
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 10);
  const matches = matchesForClan(id).sort((a, b) =>
    a.matchDate < b.matchDate ? 1 : -1
  );
  return jsonResponse(paginate(matches, page, size));
}
