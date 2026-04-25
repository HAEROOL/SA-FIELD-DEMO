import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keyword = (searchParams.get("keyword") ?? "").trim();
  if (!keyword) return jsonResponse([]);
  const store = getStore();
  const lower = keyword.toLowerCase();
  const matches = store.clans
    .filter((c) => c.clanName.toLowerCase().includes(lower))
    .slice(0, 8)
    .map((c) => ({
      clanId: c.clanId,
      clanName: c.clanName,
      clanMarkUrl: c.clanMarkUrl,
      clanBackMarkUrl: c.clanBackMarkUrl,
      division: c.division,
    }));
  return jsonResponse(matches);
}
