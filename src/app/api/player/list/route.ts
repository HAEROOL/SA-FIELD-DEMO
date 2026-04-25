import { jsonResponse, paginate, parseInt0 } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { toLeaguePlayer } from "@/mocks/seed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 20);
  const store = getStore();
  const sorted = [...store.players].sort((a, b) => b.ladderPoint - a.ladderPoint);
  const slice = paginate(sorted, page, size).map(toLeaguePlayer);
  return jsonResponse(slice);
}
