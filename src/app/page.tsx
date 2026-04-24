import SearchSection from "@/components/home/SearchSection";
import Image from "next/image";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "./getQueryClient";
import { postService } from "@/apis/postService";
import { leagueService } from "@/apis/leagueService";
import TrendingPosts from "@/components/home/TrendingPosts";
import LeagueRanking from "@/components/home/LeagueRanking";
import MainLayout from "@/components/layout/MainLayout";
import TopAdBanner from "@/components/ads/TopAdBanner";

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch Trending Posts
  await queryClient.prefetchQuery({
    queryKey: ["posts", "trending", 0, 3],
    queryFn: () => postService.getTrendingPosts(0, 3),
  });

  // Prefetch League Ranking
  await queryClient.prefetchQuery({
    queryKey: ["league", "top"],
    queryFn: leagueService.getTopRankings,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex flex-col w-full min-h-screen bg-[#eaeaea] dark:bg-gray-900">
        {/* Full Width Hero Area - Moved to top */}
        <div
          className="relative w-full shadow-2xl bg-[#1a1d24] shrink-0"
          style={{
            minHeight: "250px",
            maxHeight: "360px",
            height: "360px",
          }}
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: "url('/images/background.png')",
            }}
          ></div>

          {/* Gradient Overlay for Fade Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d24] via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1d24]/80 via-transparent to-[#1a1d24]/80"></div>

          <div className="relative z-10 w-full h-full flex justify-center px-4 md:px-6 lg:px-4 xl:px-8">
            <div className="w-full max-w-[1920px] flex justify-center gap-4 lg:gap-2 xl:gap-6 h-full">
              {/* Left Spacer */}
              <div className="hidden lg:block w-[180px] min-[1740px]:w-[300px] shrink-0" />

              {/* Hero Content */}
              <div className="flex-1 max-w-5xl flex flex-col items-center justify-center py-8 text-center h-full">
                {/* Branding / Wanted Graphic Placeholder */}
                <div className="mb-6 flex flex-col items-center w-full gap-3">
                  <div className="relative w-full max-w-[300px] md:max-w-[600px] h-[100px] md:h-[150px]">
                    <Image
                      src="/images/main_logo.svg"
                      alt="Main Logo"
                      fill
                      sizes="(max-width: 768px) 300px, 600px"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="relative w-full max-w-[200px] md:max-w-[400px] h-[30px] md:h-[40px] -mt-2 md:-mt-4">
                    <Image
                      src="/images/main_statement.png"
                      alt="Main Statement"
                      fill
                      sizes="(max-width: 768px) 200px, 400px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Search Section */}
                <div className="w-full max-w-xl relative z-50">
                  <SearchSection />
                </div>
              </div>

              {/* Right Spacer */}
              <div className="hidden lg:block w-[180px] min-[1740px]:w-[300px] shrink-0" />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <MainLayout>
          {/* Top Ad Banner */}
          <TopAdBanner />

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Trending Posts */}
            <div className="lg:col-span-2">
              <TrendingPosts />
            </div>

            {/* Right: League Ranking */}
            <div className="lg:col-span-1">
              <LeagueRanking />
            </div>
          </div>
        </MainLayout>
      </div>
    </HydrationBoundary>
  );
}
