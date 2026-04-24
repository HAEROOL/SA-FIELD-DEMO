import { PlayerInfo } from "@/apis/types/user.type";
import Link from "next/link";
import { ClanLogo } from "@/components/ui/ClanLogo";
import {
  calculateWinRate,
  calculateKDA,
  calculateAvgKills,
  formatNumber,
  formatLadderPoint,
  getLadderPointColorClass,
  getKdaColorClass,
  getWinRateColorClass,
} from "@/utils/stats";

interface SeasonStatsProps {
  playerInfo: PlayerInfo;
}

export default function SeasonStats({ playerInfo }: SeasonStatsProps) {
  const totalGames = playerInfo.totalWin + playerInfo.totalLose;
  const winRate = formatNumber(
    calculateWinRate(playerInfo.totalWin, playerInfo.totalLose)
  );
  const kda = calculateKDA(
    playerInfo.totalKill,
    playerInfo.totalDeath,
    0 // API might not have total assists in SeasonStats, check playerInfo
  );
  const avgKills = formatNumber(
    calculateAvgKills(playerInfo.totalKill, totalGames)
  );

  // 시즌 전체 정보 패널용: 기본 색상(회색)을 흰색으로 교체
  const winRateColor = getWinRateColorClass(parseFloat(winRate)).replace("text-gray-400", "text-white");
  const kdaColor = getKdaColorClass(kda).replace("text-gray-400", "text-white");
  const ladderColor = getLadderPointColorClass(playerInfo.ladderPoint).replace("text-gray-400", "text-white");

  return (
    <div className="bg-[#2d3038] border border-gray-700 p-6 shadow-sm h-full">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <i className="fas fa-trophy text-brand-500"></i>
        시즌 전체 정보
      </h3>

      {/* 시즌 정보 */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <span className="text-sm font-bold text-brand-500">Current Season</span>
      </div>

      {/* 통계 목록 */}
      <div className="space-y-4">
        {/* 래더 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400">래더</span>
          <span className={`text-xl font-black ${ladderColor}`}>
            {formatLadderPoint(playerInfo.ladderPoint)}
          </span>
        </div>

        {/* 승률 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">승률</span>
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-xl font-black leading-none ${winRateColor}`}
            >
              {winRate}%
            </span>
            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
              {playerInfo.totalWin}승 {playerInfo.totalLose}패
            </span>
          </div>
        </div>

        {/* 킬뎃 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">
            킬뎃
          </span>
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-xl font-black leading-none ${kdaColor}`}
            >
              {kda.toFixed(1)}%
            </span>
            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
              {playerInfo.totalKill.toLocaleString()}킬 {playerInfo.totalDeath.toLocaleString()}데스
            </span>
          </div>
        </div>

        {/* 평균킬 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">
            평균킬
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-gray-400 mt-1 hidden xl:inline">판당</span>
            <span className="text-lg sm:text-xl font-black text-white">
              {avgKills}킬
            </span>
          </div>
        </div>

        {/* MVP */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">MVP</span>
          <span className="text-lg sm:text-xl font-black text-yellow-600 dark:text-yellow-500 shrink-0">
            {playerInfo.mvpCount}회
          </span>
        </div>

        {/* 랭킹 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">랭킹</span>
          <span className="text-lg sm:text-xl font-black text-white shrink-0">
            {playerInfo.laeguePlayerId}위
          </span>
        </div>

        {/* 소속 */}
        <div className="flex justify-between items-center py-3">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">소속</span>
          <div className="flex items-center gap-2 min-w-0 justify-end flex-1">
            {playerInfo.clanName ? (
              <Link
                href={`/clan/${playerInfo.clanId}`}
                className="hover:underline cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  {playerInfo.clanName && (
                    <ClanLogo
                      clanName={playerInfo.clanName}
                      clanMarkUrl={playerInfo.clanMarkUrl}
                      clanBackMarkUrl={playerInfo.clanBackMarkUrl}
                      size="sm"
                      className="w-6 h-6 sm:w-8 sm:h-8 xl:w-10 xl:h-10 shrink-0"
                    />
                  )}
                  <span className="text-lg sm:text-xl font-black text-brand-500 truncate">
                    {playerInfo.clanName}
                  </span>
                </div>
              </Link>
            ) : (
              <span className="text-lg sm:text-xl font-black text-gray-400">-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
