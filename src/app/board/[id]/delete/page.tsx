"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BoardHeader from "@/components/board/BoardHeader";
import TopAdBanner from "@/components/ads/TopAdBanner";
import { postService } from "@/apis/postService";
import { useDeletePost } from "@/hooks/mutations/usePost";
import PasswordVerifyForm from "@/components/board/PasswordVerifyForm";

export default function BoardDeletePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const from = searchParams.get("from") ?? "popular";

  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost(id);

  const handleCancel = () => {
    router.push(`/board/${id}?from=${from}`);
  };

  const handleSubmit = async (password: string) => {
    setIsVerifying(true);
    setError("");

    try {
      const result = await postService.verifyPostPassword(id, password);
      if (!result.valid) {
        setError("비밀번호가 올바르지 않습니다.");
        return;
      }
    } catch {
      setError("비밀번호 확인에 실패했습니다. 다시 시도해주세요.");
      return;
    } finally {
      setIsVerifying(false);
    }

    deletePost(password, {
      onSuccess: () => {
        router.push(`/board?board=${from}`);
      },
      onError: () => {
        setError("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  return (
    <MainLayout>
      <TopAdBanner />
      <div className="w-full flex flex-col md:flex-row gap-6">
        <BoardHeader
          activeBoard={from}
          onBoardChange={(newBoardId) => router.push(`/board?board=${newBoardId}`)}
        />
        <div className="grow min-w-0 flex flex-col items-center">
          <PasswordVerifyForm
            title="게시글 삭제"
            description="삭제하려면 게시글 비밀번호를 입력하세요."
            submitLabel="삭제"
            submitClassName="bg-red-600 hover:bg-red-500 text-white"
            isSubmitting={isVerifying || isDeleting}
            error={error}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </MainLayout>
  );
}
