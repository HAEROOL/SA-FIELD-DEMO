"use client";

import { useEffect, useState, useCallback } from "react";
import MatchHistoryItem from "./MatchHistoryItem";
import {
  Match,
  MatchSummary,
  PersonalStats,
  TeamSummary,
  DetailData,
  Player,
  Team,
} from "@/types/match";
import { userService } from "@/apis/userService";
import { PlayerMatch, PlayerMatchParticipant } from "@/apis/types/user.type";
import { calculateKDAPercent, calculateKDA } from "@/utils/stats";
import { getRelativeTime } from "@/utils/date";
import Loader from "@/components/common/Loader";

interface UserRecordProps {
  nexonOuid: string;
}

export default function UserRecord({ nexonOuid }: UserRecordProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("refresh-match-history", handleRefresh);
    return () => window.removeEventListener("refresh-match-history", handleRefresh);
  }, []);

  // Pagination
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const transformMatchData = useCallback(
    (match: PlayerMatch): Match => {
      // Identify 'me'
      const me = match.participants.find((p) => p.nexonOuId === nexonOuid);
      const myTeamSide = me?.teamSide || "RED";

      // API now explicitly maps teams to RED/BLUE sides
      const redParticipants = match.participants.filter((p) => p.teamSide === "RED");
      const blueParticipants = match.participants.filter((p) => p.teamSide === "BLUE");

      // Map to "My Team" and "Enemy Team" using explicit RED/BLUE naming
      const myTeamName = myTeamSide === "RED" ? match.clanRedName : match.clanBlueName;
      const enemyTeamName = myTeamSide === "RED" ? match.clanBlueName : match.clanRedName;
      const myTeamMarkUrl = myTeamSide === "RED" ? match.clanRedMarkUrl : match.clanBlueMarkUrl;
      const enemyTeamMarkUrl = myTeamSide === "RED" ? match.clanBlueMarkUrl : match.clanRedMarkUrl;
      const myTeamBackMarkUrl = myTeamSide === "RED" ? match.clanRedBackMarkUrl : match.clanBlueBackMarkUrl;
      const enemyTeamBackMarkUrl = myTeamSide === "RED" ? match.clanBlueBackMarkUrl : match.clanRedBackMarkUrl;

      const myTeamParticipants = myTeamSide === "RED" ? redParticipants : blueParticipants;
      const enemyTeamParticipants = myTeamSide === "RED" ? blueParticipants : redParticipants;

      const isMyTeamWinner = me?.result === "승리";

      const myTeamScore = myTeamSide === "RED" ? match.scoreRed : match.scoreBlue;
      const enemyTeamScore = myTeamSide === "RED" ? match.scoreBlue : match.scoreRed;

      // Match Summary
      const match_summary: MatchSummary = {
        map_name: match.matchMap,
        play_time: "-",
        result: me?.result || "-",
        timestamp_relative: getRelativeTime(match.matchDate),
        match_category: "클랜전",
        lpChange: me?.lpChange ?? match.changePoints ?? 0,
      };

      // Personal Stats
      const personal_stats: PersonalStats = {
        kda: {
          kills: me?.kills || 0,
          deaths: me?.deaths || 0,
          assists: me?.assists || 0,
        },
        kda_ratio: calculateKDA(me?.kills || 0, me?.deaths || 0, me?.assists || 0),
      };

      const mapToPlayer = (p: PlayerMatchParticipant): Player => ({
        nickname: p.nickname,
        is_mvp: p.isMvp,
        ladder_status: "-",
        points: p.playerLadderPoint,
        kda: {
          kill: p.kills,
          death: p.deaths,
          assist: p.assists,
          ratio: calculateKDAPercent(p.kills, p.deaths),
        },
        weapon: p.weaponType || "-",
        weaponType: p.weaponType,
        damage: p.damage,
        headshot: { count: p.headshots, ratio: 0 },
        role: null,
        playerId: p.playerId,
        nexonOuId: p.nexonOuId,
        clanName: p.clanName,
        clanMarkUrl: p.clanMarkUrl,
        clanBackMarkUrl: p.clanBackMarkUrl,
        is_self: p.nexonOuId === nexonOuid,
      });

      const mapToPlayerSummary = (p: PlayerMatchParticipant) => ({
        nickname: p.nickname,
        tag: null as string | null,
        is_self: p.nexonOuId === nexonOuid,
        playerId: p.playerId,
        nexonOuId: p.nexonOuId,
        clanName: p.clanName,
        clanMarkUrl: p.clanMarkUrl,
        clanBackMarkUrl: p.clanBackMarkUrl,
        is_mvp: p.isMvp,
        role: (p.weaponType === "SNIPER" ? "S" : null) as "S" | "TS" | null,
      });

      const myTeamDivision = myTeamSide === "RED" ? match.clanRedDivision : match.clanBlueDivision;
      const enemyTeamDivision = myTeamSide === "RED" ? match.clanBlueDivision : match.clanRedDivision;
      const myTeamLadderPoint = myTeamSide === "RED" ? match.clanRedLadderPoint : match.clanBlueLadderPoint;
      const enemyTeamLadderPoint = myTeamSide === "RED" ? match.clanBlueLadderPoint : match.clanRedLadderPoint;

      const myTeamSummary: TeamSummary = {
        team_name: myTeamName,
        league_info: "-",
        side: myTeamSide,
        is_winner: isMyTeamWinner,
        score: myTeamScore,
        clanId: myTeamSide === "RED" ? match.clanRedId : match.clanBlueId,
        division: myTeamDivision,
        clanLadderPoint: myTeamLadderPoint,
        clanMarkUrl: myTeamMarkUrl,
        clanBackMarkUrl: myTeamBackMarkUrl,
        players: myTeamParticipants.map(mapToPlayerSummary),
      };

      const enemyTeamSummary: TeamSummary = {
        team_name: enemyTeamName,
        league_info: "-",
        side: myTeamSide === "RED" ? "BLUE" : "RED",
        is_winner: !isMyTeamWinner,
        score: enemyTeamScore,
        clanId: myTeamSide === "RED" ? match.clanBlueId : match.clanRedId,
        division: enemyTeamDivision,
        clanLadderPoint: enemyTeamLadderPoint,
        clanMarkUrl: enemyTeamMarkUrl,
        clanBackMarkUrl: enemyTeamBackMarkUrl,
        players: enemyTeamParticipants.map(mapToPlayerSummary),
      };

      const myTeamDetail: Team = {
        team_name: myTeamName,
        result: isMyTeamWinner ? "승리" : "패배",
        side: myTeamSide,
        total_points: myTeamScore,
        division: myTeamDivision,
        clanLadderPoint: myTeamLadderPoint,
        clanMarkUrl: myTeamMarkUrl,
        clanBackMarkUrl: myTeamBackMarkUrl,
        players: myTeamParticipants.map(mapToPlayer),
      };

      const enemyTeamDetail: Team = {
        team_name: enemyTeamName,
        result: !isMyTeamWinner ? "승리" : "패배",
        side: myTeamSide === "RED" ? "BLUE" : "RED",
        total_points: enemyTeamScore,
        division: enemyTeamDivision,
        clanLadderPoint: enemyTeamLadderPoint,
        clanMarkUrl: enemyTeamMarkUrl,
        clanBackMarkUrl: enemyTeamBackMarkUrl,
        players: enemyTeamParticipants.map(mapToPlayer),
      };

      const detailData: DetailData = {
        match_info: {
          map_name: match.matchMap,
          matchType: "5vs5",
          start_time: (match.matchDate || new Date().toISOString()).split("T")[0],
          league_type: "클랜전",
        },
        teams: [myTeamDetail, enemyTeamDetail],
      };

      return {
        id: match.matchId,
        match_summary,
        personal_stats,
        teams: [myTeamSummary, enemyTeamSummary],
        detailData,
      };
    },
    [nexonOuid]
  );

  // MOCK DATA FOR VERIFICATION - moved outside to prevent re-creation


  const fetchMatches = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      if (!nexonOuid) return;
      try {
        setLoading(true);
        setError(false);

        let matchData: PlayerMatch[] = [];
        let isLastPage = true;

        try {
          const response = await userService.getPlayerMatches(
            nexonOuid,
            pageNum,
            PAGE_SIZE,
            Date.now()
          );
          matchData = response.content || [];
          isLastPage = response.last;
        } catch (e) {
          console.warn("API failed", e);
          matchData = [];
        }

        setHasMore(!isLastPage);

        const transformed = matchData.map(transformMatchData);

        setMatches((prev) =>
          isLoadMore ? [...prev, ...transformed] : transformed
        );
      } catch (err) {
        console.error("Failed to fetch matches:", err);
        if (!isLoadMore) setError(true);
      } finally {
        setLoading(false);
      }
    },
    [nexonOuid, transformMatchData]
  );

  useEffect(() => {
    setMatches([]);
    setPage(0);
    setHasMore(true);
    fetchMatches(0);
  }, [nexonOuid, refreshKey, fetchMatches]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMatches(nextPage, true);
  };

  const toggleMatch = (id: number) => {
    setExpandedMatch(expandedMatch === id ? null : id);
  };

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
            <MatchHistoryItem
              key={match.id}
              matchId={match.id}
              match_summary={match.match_summary}
              personal_stats={match.personal_stats}
              teams={match.teams}
              isExpanded={expandedMatch === match.id}
              onToggle={() => toggleMatch(match.id)}
              detailsLoaded={true}
              detailData={match.detailData}
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
