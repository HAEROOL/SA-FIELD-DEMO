"use client";

import { useRouter } from "next/navigation";
import { PlayerInfo } from "@/apis/types/user.type";
import { ClanLogo } from "@/components/ui/ClanLogo";
import { useSSERefresh } from "@/hooks/useSSERefresh";
import { getRelativeTime } from "@/utils/date";
import Loader from "@/components/common/Loader";

interface UserHeaderProps {
  playerInfo: PlayerInfo;
}

export default function UserHeader({ playerInfo }: UserHeaderProps) {
  const router = useRouter();
  const { isRefreshing, isSuccess, error, startRefresh } = useSSERefresh();

  const handleRefresh = async () => {
    if (!playerInfo?.nexonOuid) {
      console.error("nexonOuid is required for refresh");
      return;
    }

    startRefresh(`search/search/player/${playerInfo.nexonOuid}/refresh`, {
      onConnect: () => {
      },
      onComplete: () => {
        // Refresh the page data
        router.refresh();
        window.dispatchEvent(new CustomEvent('refresh-match-history', { detail: { t: Date.now() } }));
      },
      onError: (err) => {
        console.error("Refresh error:", err);
      },
    });
  };
  return (
    <>
      {/* Success Toast */}
      {isSuccess && (
        <div className="fixed top-4 right-4 bg-brand-win text-white px-4 py-2 shadow-lg z-50 animate-fade-in flex items-center gap-2">
          <i className="fas fa-check-circle"></i>
          <span className="font-bold text-sm">전적이 갱신되었습니다!</span>
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

      {/* 사용자 헤더 */}
      <div className="bg-[#2d3038] border border-gray-700 p-6 mb-6 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* User Mark */}
          <div className="w-24 h-24 flex items-center justify-center text-4xl shadow-inner overflow-hidden shrink-0">
            <ClanLogo
              clanName={playerInfo.clanName || playerInfo.nickName}
              clanMarkUrl={playerInfo.clanMarkUrl}
              clanBackMarkUrl={playerInfo.clanBackMarkUrl}
              size="lg"
              className="w-full h-full text-4xl"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {playerInfo.nickName}
              </h1>
            </div>

            {/* 전적 갱신 버튼 - 닉네임 아래 */}
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
                {playerInfo.updateAt 
                  ? `최근 갱신: ${getRelativeTime(playerInfo.updateAt)}` 
                  : "전적 갱신 이력 없음"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2">
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
