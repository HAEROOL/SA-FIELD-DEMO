import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import type { PostUpdateRequestDto } from "@/apis/types/post.type";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  const payload = (await req.json()) as PostUpdateRequestDto;
  const store = getStore();
  const result = store.updatePost(postId, payload);
  if (result === "not_found") {
    return jsonResponse(
      { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  if (result === "bad_password") {
    return jsonResponse(
      { code: "INVALID_PASSWORD", message: "비밀번호가 일치하지 않습니다.", timestamp: new Date().toISOString() },
      { status: 403 }
    );
  }
  return jsonResponse(result);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("password") ?? "";
  const store = getStore();
  const result = store.deletePost(postId, password);
  if (result === "not_found") {
    return jsonResponse(
      { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  if (result === "bad_password") {
    return jsonResponse(
      { code: "INVALID_PASSWORD", message: "비밀번호가 일치하지 않습니다.", timestamp: new Date().toISOString() },
      { status: 403 }
    );
  }
  return new Response(null, { status: 204 });
}
