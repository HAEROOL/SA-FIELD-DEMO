"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import TopAdBanner from "@/components/ads/TopAdBanner";
import LeagueHeader from "@/components/league/LeagueHeader";
import LeagueRanking from "@/components/league/LeagueRanking";

function LeagueContent() {
  const searchParams = useSearchParams();
  const divisionParam = searchParams.get("division") || "1";

  const handleDivisionChange = () => {
    // Division change is handled by LeagueRanking component
  };

  return (
    <>
      {/* Top Ad Banner (Tablet Only: Above Header) */}
      <div className="hidden md:flex xl:hidden justify-center mb-6">
        <TopAdBanner />
      </div>

      <LeagueHeader />
      <LeagueRanking
        activeDivision={divisionParam}
        onDivisionChange={handleDivisionChange}
      />
      {/* <BottomAd /> */}
    </>
  );
}

export default function LeaguePage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        }
      >
        <LeagueContent />
      </Suspense>
    </MainLayout>
  );
}

