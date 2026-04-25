"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { LeftAd, RightAd, BottomAd } from "@/components/layout/SideAds";
import MainLayout from "@/components/layout/MainLayout";
import BoardDetail from "@/components/board/BoardDetail";
import BoardHeader from "@/components/board/BoardHeader";
// 데모 환경에서는 광고 비활성화
// import TopAdBanner from "@/components/ads/TopAdBanner";
import AsyncBoundary from "@/components/common/AsyncBoundary";

interface BoardDetailPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default function BoardDetailPage({ searchParams }: BoardDetailPageProps) {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [fromBoard, setFromBoard] = useState("popular");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    searchParams.then((params) => {
      setFromBoard(params.from || "popular");
      setMounted(true);
    });
  }, [searchParams]);

  const handleBoardChange = (boardId: string) => {
    router.push(`/board?board=${boardId}`);
  };

  if (!mounted) {
    return (
      <div className="flex justify-center w-full grow relative">
        {/* <LeftAd /> */}
        <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-64 shrink-0">
            <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="grow">
            <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        {/* <RightAd /> */}
      </div>
    );
  }

  return (
    <MainLayout>
      {/* Top Ad Banner */}
      {/* <TopAdBanner /> */}

      <div className="w-full flex flex-col md:flex-row gap-6">
        <BoardHeader
          activeBoard={fromBoard}
          onBoardChange={handleBoardChange}
        />
        
        <div className="grow min-w-0">
          <AsyncBoundary
            pendingFallback={
              <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            }
          >
            <BoardDetail id={id || ""} fromBoard={fromBoard} />
          </AsyncBoundary>
        </div>
      </div>
    </MainLayout>
  );
}
