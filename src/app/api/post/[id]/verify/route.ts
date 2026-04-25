import { jsonResponse } from "@/mocks/helpers";
import { getStore } from "@/mocks/store";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = Number(id);
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  const password = body.password ?? "";
  const store = getStore();
  return jsonResponse(store.verifyPassword(postId, password));
}
