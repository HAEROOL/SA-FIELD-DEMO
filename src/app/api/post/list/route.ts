import { jsonResponse, parseInt0, toPostPage } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import type { BoardType } from "@/apis/types/post.type";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "").trim() || undefined;
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 15);
  const store = getStore();
  const posts = store.listPosts(type as BoardType | undefined);
  const notices = store.listNotices();
  return jsonResponse({
    notices: toPostPage(notices, 0, Math.max(size, notices.length || size)),
    posts: toPostPage(posts, page, size),
  });
}
