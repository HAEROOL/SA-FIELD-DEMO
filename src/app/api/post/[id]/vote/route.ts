import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import { cookies } from "next/headers";

const COOKIE_NAME = "sa_demo_client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  const { searchParams } = new URL(req.url);
  const voteType = (searchParams.get("voteType") ?? "") as "LIKE" | "DISLIKE";
  if (voteType !== "LIKE" && voteType !== "DISLIKE") {
    return jsonResponse(
      { code: "BAD_REQUEST", message: "voteType은 LIKE 또는 DISLIKE여야 합니다.", timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
  const jar = await cookies();
  let clientId = jar.get(COOKIE_NAME)?.value;
  const shouldSet = !clientId;
  if (!clientId) {
    clientId = `demo-${Math.random().toString(36).slice(2, 10)}`;
  }
  const store = getStore();
  const outcome = store.vote(clientId, postId, voteType);
  if (outcome === "not_found") {
    return jsonResponse(
      { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  const body =
    outcome === "cancelled"
      ? "투표가 취소되었습니다."
      : outcome === "liked"
      ? "좋아요를 눌렀습니다."
      : "싫어요를 눌렀습니다.";
  const res = jsonResponse(body);
  if (shouldSet) {
    res.headers.append(
      "Set-Cookie",
      `${COOKIE_NAME}=${clientId}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
    );
  }
  return res;
}
