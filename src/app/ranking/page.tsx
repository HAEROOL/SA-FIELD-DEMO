"use client";

import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TopAdBanner from "@/components/ads/TopAdBanner";
import RankingHeader from "@/components/ranking/RankingHeader";
import PersonalRanking from "@/components/ranking/PersonalRanking";

export default function RankingPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        }
      >
        {/* Top Ad Banner (Tablet Only: Above Header) */}
        <div className="hidden md:flex xl:hidden justify-center mb-6">
          <TopAdBanner />
        </div>

        <RankingHeader />
        <PersonalRanking />
      </Suspense>
    </MainLayout>
  );
}
