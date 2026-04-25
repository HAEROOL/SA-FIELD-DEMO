"use client";

import { useState, useCallback, useEffect } from "react";
import { leagueService } from "@/apis/leagueService";
import { LeaguePlayer } from "@/apis/types/league.type";
import PlayerRankingTable, {
  PlayerRankingItem,
} from "@/components/ranking/PlayerRankingTable";
// 데모 환경에서는 광고 비활성화
// import TopAdBanner from "@/components/ads/TopAdBanner";
import { calculateWinRate } from "@/utils/stats";

const ITEMS_PER_PAGE = 20;

export default function PersonalRanking() {
  const [players, setPlayers] = useState<LeaguePlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch Players
  const fetchPlayers = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        setLoading(true);
        const data = await leagueService.getPlayerList(pageNum, ITEMS_PER_PAGE);

        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setPlayers((prev) => (reset ? data : [...prev, ...data]));
      } catch (error) {
        console.error("Failed to fetch player ranking:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial Fetch
  useEffect(() => {
    if (players.length === 0) {
      fetchPlayers(0, true);
    }
  }, [fetchPlayers, players.length]);

  // Map Data to Common Interface
  const mappedData: PlayerRankingItem[] = players
    .map((player, index) => {
      const winRate = calculateWinRate(player.totalWin, player.totalLose);

      return {
        id: player.nexonOuid,
        rank: index + 1,
        name: player.nickName,
        clanName: player.clanName ?? undefined,
        clanMarkUrl: player.clanMarkUrl ?? null,
        clanBackMarkUrl: player.clanBackMarkUrl ?? null,
        wins: player.totalWin,
        losses: player.totalLose,
        winRate,
        points: player.ladderPoint,
      };
    });

  // Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlayers(nextPage, false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Top Banner (Mobile & Desktop: Between Header and Table) */}
      {/* <div className="flex md:hidden xl:flex justify-center mb-6">
        <TopAdBanner />
      </div> */}

      <div className="bg-white dark:bg-brand-800 border-x border-b border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Table */}
      <PlayerRankingTable
        data={mappedData}
        loading={loading}
        emptyMessage="데이터가 없습니다."
      />

      {/* Load More Button */}
      {hasMore && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center bg-gray-50 dark:bg-brand-900/30">
          <button
            className="px-8 py-3 text-sm font-bold bg-[#2d3038] text-white hover:bg-brand-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLoadMore}
            disabled={loading}
          >
            <span>{loading ? "로딩 중..." : "더보기"}</span>
      </button>
        </div>
      )}
      </div>
    </div>
  );
}
