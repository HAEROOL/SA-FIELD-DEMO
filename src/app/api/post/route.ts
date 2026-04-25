import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import type { PostCreateRequestDto } from "@/apis/types/post.type";

export async function POST(req: Request) {
  const payload = (await req.json()) as PostCreateRequestDto;
  if (!payload?.title || !payload?.content || !payload?.boardType || !payload?.password) {
    return jsonResponse(
      { code: "BAD_REQUEST", message: "필수 항목이 누락되었습니다.", timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
  const store = getStore();
  const id = store.createPost(payload);
  return jsonResponse(id);
}
