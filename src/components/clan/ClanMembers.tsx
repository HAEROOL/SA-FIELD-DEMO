"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { clanService } from "@/apis/clanService";
import { ClanMember, ClanInfo } from "@/apis/types/clan.type";
import { formatLadderPoint, getLadderPointColorClass, getWinRateColorClass } from "@/utils/stats";
import { ClanLogo } from "@/components/ui/ClanLogo";
import RankBadge from "@/components/common/RankBadge";

interface ClanMembersProps {
  clanId?: number;
  clanInfo?: ClanInfo;
}

export default function ClanMembers({ clanId, clanInfo }: ClanMembersProps) {
  const [members, setMembers] = useState<ClanMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [sortBy, setSortBy] = useState<"ladder" | "wins" | "losses" | "winRate">(
    "ladder"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      if (!clanId) return;
      try {
        setLoading(true);
        setError(false);
        const data = await clanService.getClanMembers(clanId.toString());
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch clan members:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [clanId]);

  // 승률 계산
  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    return total === 0 ? 0 : (wins / total) * 100;
  };

  // 검색 및 정렬
  const filteredAndSortedMembers = useMemo(() => {
    let result = [...members];

    // 검색 필터
    if (searchQuery) {
      result = result.filter((member) =>
        member.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === "ladder") {
        return b.ladderPoints - a.ladderPoints;
      } else if (sortBy === "wins") {
        return b.totalWins - a.totalWins;
      } else if (sortBy === "losses") {
        return b.totalLosses - a.totalLosses;
      } else {
        return (
          getWinRate(b.totalWins, b.totalLosses) -
          getWinRate(a.totalWins, a.totalLosses)
        );
      }
    });

    return result;
  }, [members, searchQuery, sortBy]);

  if (loading && members.length === 0) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse">
        <div className="h-10 bg-[#2d3038] w-full"></div>
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error && members.length === 0) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm p-10 text-center">
        <i className="fas fa-exclamation-circle text-4xl text-brand-lose mb-3"></i>
        <p className="text-brand-lose font-bold">데이터를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-4">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="px-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-users text-brand-500"></i> 클랜원 목록
            <span className="text-sm font-normal text-gray-400 ml-2">총 {members.length}명</span>
          </h2>
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <div className="relative">
             <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="클랜원 닉네임 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-brand-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-brand-800 border-x border-b border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-center table-fixed border-collapse">
            <thead className="text-[10px] sm:text-xs text-gray-400 bg-[#2d3038] uppercase border-b border-gray-700">
              <tr className="flex items-center justify-between px-4 py-3">
                <th 
                    className="w-10 sm:w-14 shrink-0 text-center cursor-pointer hover:text-white transition"
                    onClick={() => setSortBy("ladder")}
                >
                    #
                </th>
                <th className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">플레이어</th>
                <th 
                    className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center cursor-pointer hover:text-white transition"
                    onClick={() => setSortBy("wins")}
                >
                    승리 {sortBy === "wins" && <i className="fas fa-sort-down text-brand-500 ml-1"></i>}
                </th>
                <th 
                    className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center cursor-pointer hover:text-white transition"
                    onClick={() => setSortBy("losses")}
                >
                    패배 {sortBy === "losses" && <i className="fas fa-sort-down text-brand-500 ml-1"></i>}
                </th>
                <th 
                    className="w-16 sm:w-24 shrink-0 text-center cursor-pointer hover:text-white transition"
                    onClick={() => setSortBy("winRate")}
                >
                    승률 {sortBy === "winRate" && <i className="fas fa-sort-down text-brand-500 ml-1"></i>}
                </th>
                <th 
                    className="w-20 sm:w-28 shrink-0 text-center cursor-pointer hover:text-white transition"
                    onClick={() => setSortBy("ladder")}
                >
                    래더 {sortBy === "ladder" && <i className="fas fa-sort-down text-brand-500 ml-1"></i>}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedMembers.map((member, index) => {
                const winRate = getWinRate(member.totalWins, member.totalLosses);
                const rateColorClass = getWinRateColorClass(winRate);

                return (
                  <tr
                    key={member.playerId}
                    className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-brand-700/30 transition"
                  >
                    {/* 1. 순위 */}
                    <td className="w-10 sm:w-14 shrink-0 text-center">
                      <RankBadge rank={index + 1} />
                    </td>

                    {/* 2. 플레이어 이름 */}
                    <td className="w-32 sm:w-44 md:w-52 shrink-0 text-left px-2 sm:px-4">
                      <Link
                        href={`/user/${member.nexonOuid ?? member.playerId}`}
                        className="flex items-center gap-2 group"
                      >
                       <ClanLogo
                            clanName={clanInfo?.clanName || "기본 클랜"}
                            clanMarkUrl={clanInfo?.clanMarkUrl}
                            clanBackMarkUrl={clanInfo?.clanBackMarkUrl}
                            size="sm"
                          />
                        <div className="truncate">
                          <div className="text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 truncate">
                            {member.nickname}
                          </div>
                        </div>
                      </Link>
                    </td>

                    {/* 3. 승리 */}
                    <td className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center text-brand-win whitespace-nowrap">
                      {member.totalWins}승
                    </td>

                    {/* 4. 패배 */}
                    <td className="hidden min-[550px]:table-cell w-14 sm:w-20 shrink-0 text-center text-brand-lose whitespace-nowrap">
                      {member.totalLosses}패
                    </td>

                    {/* 5. 승률 */}
                    <td className={`w-16 sm:w-24 shrink-0 text-center text-xs sm:text-sm ${rateColorClass}`}>
                      {winRate.toFixed(1)}%
                    </td>

                    {/* 6. 래더 점수 */}
                    <td className={`w-20 sm:w-28 shrink-0 text-center text-xs sm:text-sm ${getLadderPointColorClass(member.ladderPoints)}`}>
                      {formatLadderPoint(member.ladderPoints)}
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {filteredAndSortedMembers.length === 0 && (
                <tr>
                   <td className="py-12 text-center text-gray-500 dark:text-gray-400 w-full flex justify-center items-center">
                    <div className="flex flex-col items-center gap-2">
                        <i className="fas fa-user-friends text-4xl opacity-20"></i>
                        <p>{searchQuery ? "검색 결과가 없습니다." : "클랜원이 없습니다."}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
