import { ClanInfo } from "@/apis/types/clan.type";
import { formatLadderPoint, getLadderPointColorClass, getWinRateColorClass } from "@/utils/stats";

interface ClanSeasonStatsProps {
  clanInfo?: ClanInfo;
}

export default function ClanSeasonStats({ clanInfo }: ClanSeasonStatsProps) {
  if (!clanInfo) {
    return (
      <div className="bg-[#2d3038] border border-gray-700 p-6 shadow-sm h-full animate-pulse">
        <div className="h-6 w-32 bg-gray-700 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-700"></div>
          <div className="h-4 w-full bg-gray-700"></div>
          <div className="h-4 w-full bg-gray-700"></div>
        </div>
      </div>
    );
  }

  // Calculate win rate
  const totalGames =
    clanInfo.seasonWins + clanInfo.seasonLosses + clanInfo.seasonDraws;
  const winRate =
    totalGames > 0
      ? ((clanInfo.seasonWins / totalGames) * 100).toFixed(1)
      : "0.0";
  const winRateNum = parseFloat(winRate);

  // 시즌 전체 정보 패널용: 기본 색상(회색)을 흰색으로 교체
  const winRateColor = getWinRateColorClass(winRateNum).replace("text-gray-400", "text-white");
  const ladderColor = getLadderPointColorClass(clanInfo.ladderPoints).replace("text-gray-400", "text-white");

  return (
    <div className="bg-[#2d3038] border border-gray-700 p-6 shadow-sm h-full">
      <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
        <i className="fas fa-trophy text-brand-500"></i>
        시즌 전체 정보
      </h3>

      {/* 시즌 정보 */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <span className="text-sm font-bold text-brand-500">Pre Season</span>
      </div>

      {/* 통계 목록 */}
      <div className="space-y-4">
        {/* 래더 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400">래더</span>
          <span className={`text-xl font-black ${ladderColor}`}>
            {formatLadderPoint(clanInfo.ladderPoints)}
          </span>
        </div>

        {/* 전적 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">전적</span>
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-xl font-black leading-none ${winRateColor}`}
            >
              {winRate}%
            </span>
            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
              {clanInfo.seasonWins}승 {clanInfo.seasonLosses}패
            </span>
          </div>
        </div>

        {/* 랭킹 */}
        <div className="flex justify-between items-center py-3 border-b border-gray-700">
          <span className="text-base font-bold text-gray-400 shrink-0 mr-2">랭킹</span>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xl font-black text-white leading-none">
              {clanInfo.rank != null && clanInfo.rank > 0 ? `${clanInfo.rank}위` : "-위"}
            </span>
            <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap">
              {clanInfo.division}부 리그
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
