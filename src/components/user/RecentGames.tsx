"use client";

import { useEffect, useState, useMemo } from "react";
import { userService } from "@/apis/userService";
import { PlayerMatch } from "@/apis/types/user.type";
import RecentGamesView, { OpponentStatView } from "@/components/common/RecentGamesView";

interface RecentGamesProps {
  nexonOuid: string;
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

export default function RecentGames({ nexonOuid }: RecentGamesProps) {
  const [games, setGames] = useState<PlayerMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("refresh-match-history", handleRefresh);
    return () => window.removeEventListener("refresh-match-history", handleRefresh);
  }, []);

  useEffect(() => {
    const fetchRecentGames = async () => {
      if (!nexonOuid) {
        setLoading(false);
        return;
      }
      try {
        const response = await userService.getPlayerMatches(nexonOuid, 0, 20, Date.now());
        const matchData = response.content || [];

        setGames(matchData);
      } catch (err) {
        console.error("Failed to fetch recent games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentGames();
  }, [nexonOuid, refreshKey]);

  const stats = useMemo(() => {
    if (games.length === 0) return null;

    const recent20 = games.slice(0, 20);
    const wins = recent20.filter((match) => {
        const me = match.participants.find((p) => p.nexonOuId === nexonOuid);
        return me?.result === "승리";
    }).length;
    const losses = recent20.length - wins;
    const winRate = ((wins / recent20.length) * 100).toFixed(0); // Integer % 
    
    // Streak
    let currentStreak = 0;
    let isWinStreak = false;
    if (recent20.length > 0) {
        const firstResult = recent20[0].participants.find(p => p.nexonOuId === nexonOuid)?.result;
        isWinStreak = firstResult === "승리";
        for (const match of recent20) {
            const me = match.participants.find(p => p.nexonOuId === nexonOuid);
            if (me?.result === (isWinStreak ? "승리" : "패배")) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Opponent Stats Aggregation
    const opponentMap = new Map<string, OpponentStat>();

    recent20.forEach(match => {
        const me = match.participants.find(p => p.nexonOuId === nexonOuid);
        if (!me) return;

        const myTeamSide = me.teamSide;
        const opponentSide = myTeamSide === "RED" ? "BLUE" : "RED";

        // API now explicitly maps clans to RED/BLUE sides
        const opponentName = opponentSide === "RED" ? match.clanRedName : match.clanBlueName;
        const opponentMarkUrl = opponentSide === "RED" ? match.clanRedMarkUrl : match.clanBlueMarkUrl;
        const opponentBackMarkUrl = opponentSide === "RED" ? match.clanRedBackMarkUrl : match.clanBlueBackMarkUrl;
        
        const existing = opponentMap.get(opponentName) || {
            clanName: opponentName,
            clanMarkUrl: opponentMarkUrl,
            clanBackMarkUrl: opponentBackMarkUrl,
            totalGames: 0,
            wins: 0,
            losses: 0,
            myKills: 0,
            myDeaths: 0
        };

        existing.totalGames += 1;
        if (me.result === "승리") existing.wins += 1;
        else existing.losses += 1;
        
        existing.myKills += me.kills;
        existing.myDeaths += me.deaths;

        opponentMap.set(opponentName, existing);
    });

    const opponentList: OpponentStatView[] = Array.from(opponentMap.values())
        .sort((a, b) => b.totalGames - a.totalGames) // Sort by frequency
        .slice(0, 3) // Top 3
        .map(opp => {
             const kdRatio = (opp.myKills + opp.myDeaths) > 0 
                ? ((opp.myKills / (opp.myKills + opp.myDeaths)) * 100).toFixed(1) 
                : "0.0";
             const oppWinRate = ((opp.wins / opp.totalGames) * 100).toFixed(1);

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

    // Recent individual games KD
    const recentMatchesKD = recent20.slice(0, 10).map(match => {
        const me = match.participants.find(p => p.nexonOuId === nexonOuid);
        return {
            result: (me?.result === "승리" ? "W" : "L") as "W" | "L",
            kills: me?.kills || 0,
            deaths: me?.deaths || 0,
            assists: me?.assists || 0
        };
    });

    return {
        total: recent20.length,
        wins,
        losses,
        winRate,
        isWinStreak,
        currentStreak,
        opponentList,
        recentMatchesKD
    };
  }, [games, nexonOuid]);

  if (!stats) {
      return <RecentGamesView total={0} wins={0} losses={0} winRate="0" isWinStreak={false} currentStreak={0} opponentList={[]} loading={loading} error={!loading && games.length === 0} />;
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
        recentMatches={stats.recentMatchesKD}
        loading={loading}
    />
  );
}
