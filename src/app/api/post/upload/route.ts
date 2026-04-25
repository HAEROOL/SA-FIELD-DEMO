import { jsonResponse } from "@/mocks/helpers";

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  const originalName =
    file && typeof file === "object" && "name" in file ? (file as File).name : "upload.png";
  const saveFileName = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
  return jsonResponse({
    accessUrl: "/images/clan-fallback.png",
    saveFileName,
    originalFileName: originalName,
  });
}
