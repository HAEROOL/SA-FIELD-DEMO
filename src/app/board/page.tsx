"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { LeftAd, RightAd, BottomAd } from "@/components/layout/SideAds";
import MainLayout from "@/components/layout/MainLayout";
import BoardHeader from "@/components/board/BoardHeader";
import BoardList from "@/components/board/BoardList";
// 데모 환경에서는 광고 비활성화
// import TopAdBanner from "@/components/ads/TopAdBanner";
import { BoardType } from "@/apis/types/post.type";
import AsyncBoundary from "@/components/common/AsyncBoundary";

const BOARD_TYPE_MAP: Record<string, BoardType | undefined> = {
  popular: undefined,
  daerul: "DAERUL",
  ranked: "RANKED",
  third: "THIRD_DIVISION",
  asupply: "A_SUPPLY",
  free: "FREE",
  broadcast: "BROADCAST",
  strategy: "STRATEGY",
  notice: "NOTICE",
};

function BoardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const boardParam = params.get("board");
  const activeBoard =
    boardParam && BOARD_TYPE_MAP.hasOwnProperty(boardParam)
      ? boardParam
      : "popular";
  const boardType = BOARD_TYPE_MAP[activeBoard];

  const handleBoardChange = (boardId: string) => {
    router.push(`/board?board=${boardId}`, { scroll: false });
  };

  return (
    <MainLayout>
      {/* Top Ad Banner */}
      {/* <TopAdBanner /> */}

      <div className="w-full flex flex-col md:flex-row md:items-start gap-6">
        <BoardHeader
          activeBoard={activeBoard}
          onBoardChange={handleBoardChange}
        />
        <div className="grow min-w-0">
          <AsyncBoundary
            key={activeBoard}
            pendingFallback={
              <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex justify-between items-center">
                  <div className="h-4 bg-gray-600 rounded w-24" />
                  <div className="h-6 bg-gray-600 rounded w-14" />
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3">
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-20 shrink-0" />
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-12 shrink-0" />
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-10 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <BoardList type={boardType} offset={0} currentBoard={activeBoard} />
          </AsyncBoundary>
        </div>
      </div>
    </MainLayout>
  );
}

export default function BoardPage() {
  return (
    <Suspense>
      <BoardContent />
    </Suspense>
  );
}
