"use client";

import { useState, useEffect, useMemo } from "react";
import { clanService } from "@/apis/clanService";
import { ClanMatch } from "@/apis/types/clan.type";
import RecentGamesView, { OpponentStatView } from "@/components/common/RecentGamesView";

interface ClanRecentGamesProps {
  clanId?: number;
}

interface OpponentStat {
  clanName: string;
  clanMarkUrl: string | null;
  clanBackMarkUrl: string | null;
  totalGames: number;
  wins: number;
  losses: number;
  myKills: number;
  myDeaths: number;
}

export default function ClanRecentGames({ clanId }: ClanRecentGamesProps) {
  const [matches, setMatches] = useState<ClanMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("refresh-match-history", handleRefresh);
    return () => window.removeEventListener("refresh-match-history", handleRefresh);
  }, []);

  // We fetch up to 20 for the stats, similar to User Detail
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(false);
        let data: ClanMatch[] = [];
        
        if (clanId) {
            try {
                // Getting page 0, size 20 for "Recent Games" analysis
                data = await clanService.getClanMatches(
                clanId.toString(),
                0,
                20,
                Date.now()
                );
            } catch {
                console.warn("API failed");
            }
        }

        if (data.length === 0) {
             setMatches([]);
        } else {
             setMatches(data);
        }
      } catch (error) {
        console.error("Failed to fetch clan matches:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [clanId, refreshKey]);

  const stats = useMemo(() => {
    if (matches.length === 0 || !clanId) return null;

    const wins = matches.filter((m) => m.winnerClanId === clanId).length;
    const total = matches.length;
    const losses = total - wins;
    const winRate = ((wins / total) * 100).toFixed(0);

    // Streak
    let currentStreak = 0;
    let isWinStreak = false;
    if (matches.length > 0) {
        const firstWin = matches[0].winnerClanId === clanId;
        isWinStreak = firstWin;
        for (const m of matches) {
            if ((m.winnerClanId === clanId) === isWinStreak) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Opponent Aggregation
    const opponentMap = new Map<string, OpponentStat>();

    matches.forEach((match) => {
        const isMyClanRed = match.clanRed === clanId;
        const opponentName = isMyClanRed ? match.clanBlueName : match.clanRedName;
        const opponentMark = isMyClanRed ? match.clanBlueMarkUrl : match.clanRedMarkUrl;
        const opponentBackMark = isMyClanRed ? match.clanBlueBackMarkUrl : match.clanRedBackMarkUrl;
        const isWin = match.winnerClanId === clanId;

        // Calculate Clan K/D for THIS match
        // Filter participants belonging to MY CLAN
        // Assuming participants have 'clanName' or we check teamSide?
        // ClanMatch has `clanRed` (Red) and `clanBlue` (Blue) explicitly.
        // Let's filter participants by teamSide.
        // Safe check: match.participants might be empty if not detailed?
        // If empty, K/D is 0.

        const myTeamSide = isMyClanRed ? "RED" : "BLUE";

        const myParticipants = match.participants?.filter(p => p.teamSide === myTeamSide) || [];
        const matchKills = myParticipants.reduce((sum, p) => sum + p.kills, 0);
        const matchDeaths = myParticipants.reduce((sum, p) => sum + p.deaths, 0);

        const existing = opponentMap.get(opponentName) || {
            clanName: opponentName,
            clanMarkUrl: opponentMark,
            clanBackMarkUrl: opponentBackMark,
            totalGames: 0,
            wins: 0,
            losses: 0,
            myKills: 0,
            myDeaths: 0
        };

        existing.totalGames += 1;
        if (isWin) existing.wins += 1;
        else existing.losses += 1;

        existing.myKills += matchKills;
        existing.myDeaths += matchDeaths;

        opponentMap.set(opponentName, existing);
    });

    const opponentList: OpponentStatView[] = Array.from(opponentMap.values())
        .sort((a, b) => b.totalGames - a.totalGames)
        .slice(0, 3)
        .map(opp => {
             const oppWinRate = ((opp.wins / opp.totalGames) * 100).toFixed(1);
             const totalKD = opp.myKills + opp.myDeaths;
             const kdRatio = totalKD > 0 ? ((opp.myKills / totalKD) * 100).toFixed(1) : "0.0";
             
             return {
                 clanName: opp.clanName,
                 clanMarkUrl: opp.clanMarkUrl,
                 clanBackMarkUrl: opp.clanBackMarkUrl,
                 totalGames: opp.totalGames,
                 wins: opp.wins,
                 losses: opp.losses,
                 winRate: oppWinRate,
                 kdRatio: kdRatio,
                 kills: opp.myKills,
                 deaths: opp.myDeaths
             };
        });

    return {
        total,
        wins,
        losses,
        winRate,
        currentStreak,
        isWinStreak,
        opponentList
    };
  }, [matches, clanId]);

  if (!stats) {
     return <RecentGamesView total={0} wins={0} losses={0} winRate="0" isWinStreak={false} currentStreak={0} opponentList={[]} showKd={false} loading={loading} error={error} />;
  }

  return (
      <RecentGamesView
          total={stats.total}
          wins={stats.wins}
          losses={stats.losses}
          winRate={stats.winRate}
          isWinStreak={stats.isWinStreak}
          currentStreak={stats.currentStreak}
          opponentList={stats.opponentList}
          showKd={false}
          loading={loading}
      />
  );
}
