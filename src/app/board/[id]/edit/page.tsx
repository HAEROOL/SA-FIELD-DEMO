"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import BoardHeader from "@/components/board/BoardHeader";
import BoardWrite from "@/components/board/BoardWrite";
import { usePost } from "@/hooks/queries/usePosts";
// 데모 환경에서는 광고 비활성화
// import TopAdBanner from "@/components/ads/TopAdBanner";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import { postService } from "@/apis/postService";
import PasswordVerifyForm from "@/components/board/PasswordVerifyForm";

type Step = "verify" | "edit";

interface EditPostContentProps {
  id: number;
  password: string;
}

function EditPostContent({ id, password }: EditPostContentProps) {
  const { data: post } = usePost(id);

  return (
    <BoardWrite postId={id} initialData={post} initialPassword={password} />
  );
}

export default function BoardEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const from = searchParams.get("from") ?? "popular";

  const [step, setStep] = useState<Step>("verify");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const handleVerify = async (password: string) => {
    setIsVerifying(true);
    setVerifyError("");
    try {
      const result = await postService.verifyPostPassword(id, password);
      if (result.valid) {
        setVerifiedPassword(password);
        setStep("edit");
      } else {
        setVerifyError("비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setVerifyError("비밀번호 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    router.push(`/board/${id}?from=${from}`);
  };

  return (
    <MainLayout>
      {/* <TopAdBanner /> */}
      <div className="w-full flex flex-col md:flex-row gap-6">
        <BoardHeader
          activeBoard={from}
          onBoardChange={(newBoardId) => router.push(`/board?board=${newBoardId}`)}
        />
        <div className="grow min-w-0 flex flex-col items-center">
          {step === "verify" ? (
            <PasswordVerifyForm
              title="게시글 수정"
              description="수정하려면 게시글 비밀번호를 입력하세요."
              submitLabel="확인"
              isSubmitting={isVerifying}
              error={verifyError}
              onSubmit={handleVerify}
              onCancel={handleCancel}
            />
          ) : (
            <div className="w-full">
              <AsyncBoundary
                pendingFallback={
                  <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-8 flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-b-2 border-brand-500"></div>
                  </div>
                }
              >
                <EditPostContent id={id} password={verifiedPassword} />
              </AsyncBoundary>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
