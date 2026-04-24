"use client";

import { useState, useCallback, useEffect } from "react";
import ClanMatchHistoryItem from "./ClanMatchHistoryItem";
import {
  ClanInfo,
  ClanMatch,
} from "@/apis/types/clan.type";
import { clanService } from "@/apis/clanService";
import Loader from "@/components/common/Loader";

interface ClanRecordProps {
  clanId?: number;
  clanInfo?: ClanInfo;
}

export default function ClanRecord({ clanId, clanInfo }: ClanRecordProps) {
  const [matches, setMatches] = useState<ClanMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("refresh-match-history", handleRefresh);
    return () => window.removeEventListener("refresh-match-history", handleRefresh);
  }, []);

  const fetchMatches = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      try {
        setLoading(true);
        setError(false);
        let data: ClanMatch[] = [];

        if (clanId) {
            try {
                data = await clanService.getClanMatches(
                clanId.toString(),
                pageNum,
                PAGE_SIZE,
                Date.now()
                );
            } catch (error) {
                console.warn("API failed", error);
            }
        }

        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (data.length === 0 && pageNum === 0) {
            setMatches([]);
            setHasMore(false);
        } else {
             setMatches((prev) => (isLoadMore ? [...prev, ...data] : data));
        }
      } catch (error) {
        console.error("Failed to fetch clan matches:", error);
        if (!isLoadMore) setError(true);
      } finally {
        setLoading(false);
      }
    },
    [clanId]
  );

  useEffect(() => {
    setMatches([]);
    setPage(0);
    setHasMore(true);
    fetchMatches(0);
  }, [clanId, refreshKey, fetchMatches]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMatches(nextPage, true);
  };

  const toggleMatch = (id: number) => {
    setExpandedMatch(expandedMatch === id ? null : id);
  };

  if (!clanInfo) {
    return (
      <div className="bg-white dark:bg-brand-800 p-6 shadow-sm animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* Match History List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="fas fa-list text-brand-500"></i> 매치 히스토리
          </h2>
        </div>

        {error && matches.length === 0 && (
          <div className="text-center py-8 text-red-500">
            데이터를 불러오는데 실패했습니다.
          </div>
        )}

        {matches.length === 0 && !loading && !error && (
          <div className="text-center py-10 text-gray-500">
            매치 기록이 없습니다.
          </div>
        )}

        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <ClanMatchHistoryItem
              key={match.matchId}
              match={match}
              myClanId={clanId || 0}
              isExpanded={expandedMatch === match.matchId}
              onToggle={() => toggleMatch(match.matchId)}
            />
          ))}
        </div>

        {loading && <Loader size="md" className="py-4" />}

        {/* Load More */}
        {hasMore && !loading && matches.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full mt-6 py-3 bg-[#2d3038] text-white font-bold hover:bg-brand-500 hover:text-white transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-plus"></i> 더 불러오기
          </button>
        )}
      </section>
    </div>
  );
}
