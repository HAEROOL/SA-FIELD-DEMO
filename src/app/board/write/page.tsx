"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import BoardHeader from "@/components/board/BoardHeader";
import BoardWrite from "@/components/board/BoardWrite";
import TopAdBanner from "@/components/ads/TopAdBanner";
import AsyncBoundary from "@/components/common/AsyncBoundary";

function BoardWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBoard = searchParams.get("type") ?? "";

  const handleBoardChange = (boardId: string) => {
    router.push(`/board?board=${boardId}`);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <BoardHeader
        activeBoard={activeBoard}
        onBoardChange={handleBoardChange}
      />
      <div className="grow min-w-0">
        <AsyncBoundary>
          <BoardWrite />
        </AsyncBoundary>
      </div>
    </div>
  );
}

export default function BoardWritePage() {
  return (
    <MainLayout>
      <TopAdBanner />
      <Suspense>
        <BoardWriteContent />
      </Suspense>
    </MainLayout>
  );
}
