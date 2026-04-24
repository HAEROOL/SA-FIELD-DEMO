"use client";

import Link from "next/link";
import { ClanLogo } from "@/components/ui/ClanLogo";
import RankBadge from "@/components/common/RankBadge";
import { formatLadderPoint, getLadderPointColorClass, getWinRateColorClass } from "@/utils/stats";

export interface PlayerRankingItem {
  id: string;
  rank: number;
  name: string;
  clanName?: string;
  clanMarkUrl?: string | null;
  clanBackMarkUrl?: string | null;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
}

interface PlayerRankingTableProps {
  data: PlayerRankingItem[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function PlayerRankingTable({
  data,
  loading = false,
  emptyMessage = "데이터가 없습니다.",
}: PlayerRankingTableProps) {
  if (loading && data.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-center table-fixed border-collapse">
          <thead className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
            <tr className="flex items-center justify-between px-4 py-3">
              <th className="w-10 sm:w-14 shrink-0">순위</th>
              <th className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">플레이어</th>
              <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0">승리</th>
              <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0">패배</th>
              <th className="w-16 sm:w-24 shrink-0">승률</th>
              <th className="w-20 sm:w-28 shrink-0">래더</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                데이터를 불러오는 중입니다...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-center table-fixed border-collapse">
          <thead className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
            <tr className="flex items-center justify-between px-4 py-3">
              <th className="w-10 sm:w-14 shrink-0">순위</th>
              <th className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">플레이어</th>
              <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0">승리</th>
              <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0">패배</th>
              <th className="w-16 sm:w-24 shrink-0">승률</th>
              <th className="w-20 sm:w-28 shrink-0">래더</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm text-center table-fixed border-collapse">
        <thead className="text-[10px] sm:text-xs text-gray-400 bg-[#2d3038] uppercase border-b border-gray-700">
          <tr className="flex items-center justify-between px-4 py-3">
            <th className="w-10 sm:w-14 shrink-0 text-center">#</th>
            <th className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">플레이어</th>
            <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center">승리</th>
            <th className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center">패배</th>
            <th className="w-16 sm:w-24 shrink-0 text-center">승률</th>
            <th className="w-20 sm:w-28 shrink-0 text-center">래더</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((player) => {
            const rateColorClass = getWinRateColorClass(player.winRate);

            return (
              <tr
                key={player.id}
                className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-brand-700/30 transition"
              >
                {/* 1. 순위 */}
                <td className="w-10 sm:w-14 shrink-0 text-center">
                  <RankBadge rank={player.rank} />
                </td>

                {/* 2. 플레이어 이름 */}
                <td className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">
                  <Link
                    href={`/user/${player.id}`}
                    className="flex items-center gap-2 group"
                  >
                   <ClanLogo
                        clanName={player.clanName ? player.clanName : "기본 클랜"}
                        clanMarkUrl={player.clanMarkUrl}
                        clanBackMarkUrl={player.clanBackMarkUrl}
                        size="sm"
                      />
                    <div className="truncate">
                      <div className="text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 truncate">
                        {player.name}
                      </div>
                    </div>
                  </Link>
                </td>

                {/* 3. 승리 */}
                <td className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center text-brand-win whitespace-nowrap">
                  {player.wins}승
                </td>

                {/* 4. 패배 */}
                <td className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center text-brand-lose whitespace-nowrap">
                  {player.losses}패
                </td>

                {/* 5. 승률 */}
                <td className={`w-16 sm:w-24 shrink-0 text-center text-xs sm:text-sm ${rateColorClass}`}>
                  {player.winRate.toFixed(1)}%
                </td>

                {/* 6. 래더 점수 */}
                <td className={`w-20 sm:w-28 shrink-0 text-center text-xs sm:text-sm ${getLadderPointColorClass(player.points)}`}>
                  {formatLadderPoint(player.points)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
