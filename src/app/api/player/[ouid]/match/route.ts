import { jsonResponse, parseInt0, toSpringPage } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { playerMatches } from "@/mocks/seed";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ouid: string }> }
) {
  const { ouid } = await params;
  const store = getStore();
  const player =
    store.players.find((p) => p.nexonOuid === ouid) ??
    store.players.find((p) => String(p.playerId) === ouid);
  const { searchParams } = new URL(req.url);
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 10);
  if (!player) return jsonResponse(toSpringPage([], page, size));
  const matches = playerMatches(player.playerId).sort((a, b) =>
    a.matchDate < b.matchDate ? 1 : -1
  );
  return jsonResponse(toSpringPage(matches, page, size));
}
