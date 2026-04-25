"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { leagueService } from "@/apis/leagueService";
import { LeagueClan } from "@/apis/types/league.type";
import ClanRankingTable, {
  ClanRankingItem,
} from "@/components/league/ClanRankingTable";
// 데모 환경에서는 광고 비활성화
// import TopAdBanner from "@/components/ads/TopAdBanner";
import { calculateWinRate } from "@/utils/stats";

interface LeagueRankingProps {
  activeDivision: string;
  onDivisionChange: (division: string) => void;
}

export default function LeagueRanking({
  activeDivision,
  onDivisionChange,
}: LeagueRankingProps) {
  const router = useRouter();
  const [clans, setClans] = useState<LeagueClan[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Clans
  const fetchClans = useCallback(async (division: string) => {
    try {
      setLoading(true);
      const data = await leagueService.getLeagueList(division);
      setClans(data);
    } catch (error) {
      console.error("Failed to fetch clan ranking:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on division change
  useEffect(() => {
    fetchClans(activeDivision);
  }, [activeDivision, fetchClans]);

  // Map Data to Common Interface
  const mappedData: ClanRankingItem[] = useMemo(() => {
    return clans.map((clan, index) => {
      const wins = clan.seasonWins ?? 0;
      const losses = clan.seasonLosses ?? 0;
      const winRate = calculateWinRate(wins, losses);

      return {
        id: clan.clanId,
        rank: index + 1,
        name: clan.clanName,
        wins,
        losses,
        winRate,
        points: clan.ladderPoints,
        clanMarkUrl: clan.clanMarkUrl ?? null,
        clanBackMarkUrl: clan.clanBackMarkUrl ?? null,
      };
    });
  }, [clans]);

  // Division change handler
  const handleDivisionChange = (division: string) => {
    onDivisionChange(division);
    router.push(`/league?division=${division}`);
  };

  const divisions = [
    { id: "1", label: "1부" },
    { id: "2", label: "2부" },
    // { id: "3", label: "3부" },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* Top Banner (Mobile & Desktop: Between Header and Table) */}
      {/* <div className="flex md:hidden xl:flex justify-center mb-6">
        <TopAdBanner />
      </div> */}

      {/* Division Tabs */}
      <div className="flex justify-start gap-2">
        {divisions.map((division) => (
          <button
            key={division.id}
            className={`w-16 py-2 text-center text-sm font-bold transition-colors ${
              activeDivision === division.id
                ? "bg-brand-500 text-white"
                : "bg-[#2d3038] text-white hover:bg-gray-600"
            }`}
            onClick={() => handleDivisionChange(division.id)}
          >
            {division.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm">
         {/* Info */}
         {/* <div className="p-4 bg-gray-50 dark:bg-brand-900/50 border-b border-gray-200 dark:border-gray-700 flex justify-end items-center">
          <span className="text-xs text-gray-500">
            * {activeDivision}부 리그 기준 / 매일 06:00 갱신
          </span>
         </div> */}

        <ClanRankingTable
          data={mappedData}
          loading={loading}
          emptyMessage="데이터가 없습니다."
        />
      </div>
    </div>
  );
}

