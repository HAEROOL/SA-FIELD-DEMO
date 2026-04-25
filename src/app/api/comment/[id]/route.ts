import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";
import type {
  CommentSaveRequestDto,
  CommentUpdateRequestDto,
} from "@/apis/types/comment.type";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  const payload = (await req.json()) as CommentSaveRequestDto;
  if (!payload?.content) {
    return jsonResponse(
      { code: "BAD_REQUEST", message: "댓글 내용이 비어있습니다.", timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
  const store = getStore();
  const res = store.addComment(
    postId,
    payload.content,
    payload.authorName ?? null,
    payload.password,
    payload.parentId ?? null
  );
  if (!res.ok) {
    return jsonResponse(
      { code: "POST_NOT_FOUND", message: "게시글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  return new Response(null, { status: 204 });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = Number(id);
  const payload = (await req.json()) as CommentUpdateRequestDto;
  if (!payload?.content) {
    return jsonResponse(
      { code: "BAD_REQUEST", message: "댓글 내용이 비어있습니다.", timestamp: new Date().toISOString() },
      { status: 400 }
    );
  }
  const store = getStore();
  const result = store.updateComment(commentId, payload.content);
  if (result === "not_found") {
    return jsonResponse(
      { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  return jsonResponse("댓글이 수정되었습니다.");
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const commentId = Number(id);
  const store = getStore();
  const result = store.deleteComment(commentId);
  if (result === "not_found") {
    return jsonResponse(
      { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다.", timestamp: new Date().toISOString() },
      { status: 404 }
    );
  }
  return new Response(null, { status: 204 });
}
