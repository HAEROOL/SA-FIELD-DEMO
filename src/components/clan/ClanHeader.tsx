"use client";

import { useRouter } from "next/navigation";
import { ClanInfo } from "@/apis/types/clan.type";
import { ClanLogo } from "@/components/ui/ClanLogo";
import { useSSERefresh } from "@/hooks/useSSERefresh";
import { getRelativeTime } from "@/utils/date";
import Loader from "@/components/common/Loader";

interface ClanHeaderProps {
  clanInfo?: ClanInfo;
}

export default function ClanHeader({ clanInfo }: ClanHeaderProps) {
  const router = useRouter();
  const { isRefreshing, isSuccess, error, startRefresh } = useSSERefresh();

  const handleRefresh = async () => {
    if (!clanInfo?.nexonClanId) {
      console.error("nexonClanId is required for refresh");
      return;
    }

    startRefresh(`search/search/clan/${clanInfo.nexonClanId}/refresh`, {
      onConnect: () => {
      },
      onComplete: () => {
        // Refresh the page data
        router.refresh();
        window.dispatchEvent(new CustomEvent('refresh-match-history', { detail: { t: Date.now() } }));
      },
      onError: () => {
      },
    });
  };

  if (!clanInfo) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm h-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 mb-2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Toast */}
      {isSuccess && (
        <div className="fixed top-4 right-4 bg-brand-win text-white px-4 py-2 shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <i className="fas fa-check-circle"></i>
          <span className="font-bold text-sm">클랜 정보가 갱신되었습니다!</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-brand-lose text-white px-4 py-2 shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <i className="fas fa-exclamation-circle"></i>
          <span className="font-bold text-sm">
            {error.message || "갱신 중 오류가 발생했습니다."}
          </span>
        </div>
      )}

      <div className="bg-[#2d3038] border border-gray-700 p-6 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Clan Mark */}
          <div className="w-24 h-24 flex items-center justify-center text-4xl shadow-inner overflow-hidden">
            <ClanLogo
              clanName={clanInfo.clanName}
              clanMarkUrl={clanInfo.clanMarkUrl}
              clanBackMarkUrl={clanInfo.clanBackMarkUrl}
              size="lg"
              className="w-full h-full text-4xl" // Custom class to override size constraints if needed for this specific container
            />
          </div>

          {/* Clan Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {clanInfo.clanName}
              </h1>
              <span className="px-1.5 py-0.5 border border-brand-500 text-brand-500 text-[9px] font-bold uppercase tracking-wider">
                {clanInfo.division}부 리그
              </span>
            </div>

            {/* 전적 갱신 버튼 - 위치 조정됨 */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex justify-center md:justify-start">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? <Loader size="sm" /> : <i className="fas fa-sync-alt"></i>}
                  {isRefreshing ? "갱신 중..." : "전적 갱신"}
                </button>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {clanInfo.updateAt 
                  ? `최근 갱신: ${getRelativeTime(clanInfo.updateAt)}` 
                  : "전적 갱신 이력 없음"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2 self-start md:self-auto">
            <button className="w-10 h-10 bg-white dark:bg-brand-900 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-brand-accent hover:border-brand-accent transition shadow-sm">
              <i className="fas fa-heart"></i>
            </button>
            <button className="w-10 h-10 bg-white dark:bg-brand-900 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-500 transition shadow-sm">
              <i className="fas fa-share-alt"></i>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}
