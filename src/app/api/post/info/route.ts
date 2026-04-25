import { jsonResponse, parseInt0 } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = parseInt0(searchParams.get("id"), -1);
  if (id < 0) {
    return jsonResponse(
      { code: "BAD_REQUEST", message: "id가 필요합니다.", timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
  const store = getStore();
  const post = store.getPost(id);
  if (!post) {
    return jsonResponse(
      { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  return jsonResponse(post);
}
