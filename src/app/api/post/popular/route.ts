import { jsonResponse, parseInt0, toPostPage } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt0(searchParams.get("page"), 0);
  const size = parseInt0(searchParams.get("size"), 10);
  const store = getStore();
  const popular = store.listPopular();
  const notices = store.listNotices();
  return jsonResponse({
    notices: toPostPage(notices, 0, Math.max(size, notices.length || size)),
    posts: toPostPage(popular, page, size),
  });
}
