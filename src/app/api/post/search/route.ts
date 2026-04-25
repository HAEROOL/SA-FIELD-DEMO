import { jsonResponse, parseInt0, toPostPage } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardCode = parseInt0(searchParams.get("boardCode"), 0);
  const target = ((searchParams.get("searchTarget") ?? "title") as "title" | "title_content");
  const keyword = (searchParams.get("keyword") ?? "").trim();
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 15);
  const store = getStore();
  const posts = store.searchPosts(boardCode, keyword, target);
  const notices = store.listNotices();
  return jsonResponse({
    notices: toPostPage(notices, 0, Math.max(size, notices.length || size)),
    posts: toPostPage(posts, page, size),
  });
}
