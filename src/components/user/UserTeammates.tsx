"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Teammate {
  id: string;
  nickname: string;
  matches: number;
  wins: number;
  losses: number;
}

export default function UserTeammates() {
  const [sortBy, setSortBy] = useState<"matches" | "winRate">("matches");
  const [searchQuery, setSearchQuery] = useState("");



  // 승률 계산
  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    return total === 0 ? 0 : (wins / total) * 100;
  };

  // 승률 색상
  const getWinRateColor = (winRate: number) => {
    if (winRate >= 60) return "text-brand-win font-bold";
    if (winRate < 40) return "text-brand-lose font-bold";
    return "text-gray-700 dark:text-gray-300";
  };

  // 검색 및 정렬
  const filteredAndSortedTeammates = useMemo(() => {
    let result: Teammate[] = []; // No data yet

    // 검색 필터
    if (searchQuery) {
      result = result.filter((teammate) =>
        teammate.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === "matches") {
        return b.matches - a.matches;
      } else {
        return getWinRate(b.wins, b.losses) - getWinRate(a.wins, a.losses);
      }
    });

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-users text-brand-500"></i> 최근 같이한
              플레이어
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              최근 30판 기준
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="플레이어 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-brand-900 border border-gray-200 dark:border-gray-700 rounded-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-brand-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300">
                  #
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300">
                  닉네임
                </th>
                <th
                  className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-brand-500 transition"
                  onClick={() => setSortBy("matches")}
                >
                  경기 수{" "}
                  {sortBy === "matches" && (
                    <i className="fas fa-sort-down text-brand-500"></i>
                  )}
                </th>
                <th className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300">
                  승
                </th>
                <th className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300">
                  패
                </th>
                <th
                  className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-brand-500 transition"
                  onClick={() => setSortBy("winRate")}
                >
                  승률{" "}
                  {sortBy === "winRate" && (
                    <i className="fas fa-sort-down text-brand-500"></i>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTeammates.map((teammate, index) => {
                const winRate = getWinRate(teammate.wins, teammate.losses);
                return (
                  <tr
                    key={teammate.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                  >
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/user/${teammate.id}`}
                        className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
                      >
                        {teammate.nickname}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                      {teammate.matches}
                    </td>
                    <td className="px-4 py-3 text-center text-brand-win font-semibold">
                      {teammate.wins}
                    </td>
                    <td className="px-4 py-3 text-center text-brand-lose font-semibold">
                      {teammate.losses}
                    </td>
                    <td
                      className={`px-4 py-3 text-center ${getWinRateColor(
                        winRate
                      )}`}
                    >
                      {winRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredAndSortedTeammates.length === 0 && (
            <div className="p-10 text-center">
              <i className="fas fa-user-friends text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
              <p className="text-gray-500 dark:text-gray-400">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
