"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLeagueTop } from "@/hooks/queries/useLeague";
import { clsx } from "clsx";
import { useState } from "react";
import { formatLadderPoint, getLadderPointColorClass } from "@/utils/stats";
import { ClanLogo } from "../ui/ClanLogo";

type Division = "1" | "2" | "3";

export default function LeagueRanking() {
  const router = useRouter();
  const { data } = useLeagueTop();
  const [activeDivision, setActiveDivision] = useState<Division>("1");

  const rankings = data?.topRankings[activeDivision] || [];

  // Show top 3 as requested
  const displayedRankings = rankings.slice(0, 3);

  const tabs: { id: Division; label: string }[] = [
    { id: "1", label: "1부" },
    { id: "2", label: "2부" },
  ];

  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-0 overflow-hidden mb-6 shadow-sm">
      <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center">
          <i className="fas fa-crown text-yellow-500 mr-2"></i>리그 랭킹
        </h3>
        <Link
          href="/league"
          className="text-xs text-gray-400 hover:text-brand-500 transition-colors"
        >
          전체보기 <i className="fas fa-chevron-right text-[10px] ml-1"></i>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDivision(tab.id)}
            className={clsx(
              "flex-1 py-2 text-xs font-medium transition-colors relative",
              activeDivision === tab.id
                ? "text-brand-600 dark:text-brand-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            {tab.label}
            {activeDivision === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500"></span>
            )}
          </button>
        ))}
      </div>

      <div className="p-0">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 bg-[#f8f9fa] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2 text-left pl-4 w-[15%]">#</th>
              <th className="py-2 text-left w-[45%]">클랜이름</th>
              <th className="py-2 text-center w-[20%]">래더</th>
              <th className="py-2 text-center w-[20%]">승률</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            {displayedRankings.length > 0 ? (
              displayedRankings.map((clan, index) => (
                <tr
                  key={clan.clanId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition cursor-pointer"
                  onClick={() => router.push(`/clan/${clan.clanId}`)}
                >
                  <td className="py-3 pl-3">
                    <span className="font-bold text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2">
                        <ClanLogo
                            clanName={clan.clanName}
                            clanMarkUrl={clan.clanMarkUrl}
                            clanBackMarkUrl={clan.clanBackMarkUrl}
                            size="sm"
                        />
                        <span className="truncate">{clan.clanName}</span>
                    </div>
                  </td>
                  <td className={`py-3 text-center ${getLadderPointColorClass(clan.ladderPoints)}`}>
                    {formatLadderPoint(clan.ladderPoints)}
                  </td>
                  <td className="py-3 text-center text-gray-500 dark:text-gray-400">
                    {clan.winRate !== undefined 
                      ? `${clan.winRate}%` 
                      : (clan.seasonWins && (clan.seasonWins + (clan.seasonLosses || 0)) > 0)
                        ? `${Math.round((clan.seasonWins / (clan.seasonWins + (clan.seasonLosses || 0))) * 100)}%`
                        : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  랭킹 정보가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
