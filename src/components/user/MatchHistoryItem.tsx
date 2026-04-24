"use client";

import {
  MatchSummary,
  PersonalStats,
  TeamSummary,
  DetailData,
} from "@/types/match";
import { calculateKDA, formatLadderPoint, getLadderPointColorClass, getKdaColorClass } from "@/utils/stats";
import Link from "next/link";
import { ClanLogo } from "@/components/ui/ClanLogo";

interface MatchHistoryItemProps {
  matchId: number;
  match_summary: MatchSummary;
  personal_stats: PersonalStats;
  teams: [TeamSummary, TeamSummary];
  isExpanded: boolean;
  onToggle: () => void;
  detailsLoaded?: boolean;
  detailData?: DetailData;
}

export default function MatchHistoryItem({
  match_summary,
  personal_stats,
  teams,
  isExpanded,
  onToggle,
  detailsLoaded = false,
  detailData,
}: MatchHistoryItemProps) {
  const isWin = match_summary.result === "승리";
  const isDraw = match_summary.result === "무승부";
  const collapsedBg = isDraw
    ? "bg-gray-50 dark:bg-gray-800/50"
    : isWin
    ? "bg-brand-win-light/40 dark:bg-brand-win/10"
    : "bg-brand-lose-light/40 dark:bg-brand-lose/10";
  const borderColor = isDraw
    ? "border-gray-200 dark:border-gray-700"
    : isWin
    ? "border-brand-win/20 dark:border-brand-win/30"
    : "border-brand-lose/20 dark:border-brand-lose/30";

  const myTeam = teams[0];
  const enemyTeam = teams[1];

  // The instruction seems to imply a change to the main div's className and onClick.
  // Assuming 'bgColor' was intended to be 'collapsedBg' for consistency with existing variables.
  // The onClick handler should use the provided 'onToggle' prop.
  return (
    <div
      className={`relative ${isDraw ? "hover:bg-gray-100/50" : isWin ? "hover:bg-brand-win-light/50" : "hover:bg-brand-lose-light/50"} ${collapsedBg} border ${borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden`}
      onClick={onToggle}
    >
      {/* Left Result Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 ${isDraw ? "bg-gray-400" : isWin ? "bg-brand-win" : "bg-brand-lose"}`} />

      {/* Summarized View - Compact Mobile (< 475px) */}
      <div className="flex md:hidden min-[475px]:hidden pl-3 pr-2 py-2 flex-col gap-1.5 relative z-10 border-b border-gray-200 dark:border-gray-700">
        {/* Row 1: 맵 이름 - 시간 | 점수 변화 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs text-gray-900 dark:text-white truncate">
              {match_summary.map_name}
            </span>
            <span className="text-gray-400 text-xs">-</span>
            <span className="text-[10px] text-gray-400 shrink-0">
              {match_summary.timestamp_relative}
            </span>
          </div>
          <div className={`font-bold text-xs shrink-0 ${isDraw ? "text-gray-500 dark:text-gray-400" : match_summary.lpChange && match_summary.lpChange >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
            {match_summary.lpChange && match_summary.lpChange >= 0 ? "+" : ""}{match_summary.lpChange ?? 0}점
          </div>
        </div>

        {/* Row 2: 승리/패배 + KDA + 클랜 vs 클랜 (일직선, 클랜 정보만 세로) */}
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm shrink-0 w-8 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
            {match_summary.result}
          </span>
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center">
              <div className="flex items-center gap-0.5 min-w-13 justify-center">
                <span className="font-bold text-xs text-gray-900 dark:text-white">
                  {personal_stats.kda.kills}
                </span>
                <span className="text-gray-400 text-[10px]">/</span>
                <span className="font-bold text-xs text-brand-lose">
                  {personal_stats.kda.deaths}
                </span>
                <span className="text-gray-400 text-[10px]">/</span>
                <span className="font-bold text-xs text-gray-900 dark:text-white">
                  {personal_stats.kda.assists}
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-bold min-w-11.25 text-center ${getKdaColorClass(personal_stats.kda_ratio)}`}>
              ({personal_stats.kda_ratio.toFixed(1)}%)
            </span></div>
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex items-center justify-end gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${myTeam.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={myTeam.team_name}
                  clanMarkUrl={myTeam.clanMarkUrl}
                  clanBackMarkUrl={myTeam.clanBackMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {myTeam.team_name}
                </span>
              </Link>
            </div>
            <span className="text-[10px] font-bold text-gray-400 shrink-0 px-1.5">vs</span>
            <div className="flex items-center justify-start gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${enemyTeam.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={enemyTeam.team_name}
                  clanMarkUrl={enemyTeam.clanMarkUrl}
                  clanBackMarkUrl={enemyTeam.clanBackMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {enemyTeam.team_name}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <i
            className={`fas fa-chevron-down text-gray-300 transition-transform duration-300 text-sm ${
              isExpanded ? "rotate-180" : ""
            }`}
          ></i>
        </div>
      </div>

      {/* Summarized View - Regular Mobile (475px ~ 799px) */}
      <div className="hidden min-[475px]:flex md:hidden pl-3 pr-2 py-1.5 items-center justify-between gap-2 overflow-hidden relative z-10 border-b border-gray-200 dark:border-gray-700">
        {/* Left Result Indicator Bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isDraw ? "bg-gray-400" : isWin ? "bg-brand-win" : "bg-brand-lose"}`} />

        <div className="pl-1 flex items-center justify-between gap-2 w-full overflow-hidden">
          {/* 1. Match Info */}
          <div className="w-16 shrink-0 flex flex-col items-center">
            <div className="font-bold text-[11px] text-gray-900 dark:text-white mb-0.5 truncate w-full text-center">
              {match_summary.map_name}
            </div>
            <div className={`font-bold text-xs mb-0.5 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
              {match_summary.result}
            </div>
            <div className="text-[9px] text-gray-400">
              {match_summary.timestamp_relative}
            </div>
          </div>

          {/* 2. Ladder Points */}
          <div className="w-14 shrink-0 flex flex-col items-center">
            <div className="text-[9px] font-bold text-gray-800 dark:text-gray-200 mb-0.5">래더</div>
            <div className={`font-bold text-xs ${isDraw ? "text-gray-500 dark:text-gray-400" : match_summary.lpChange && match_summary.lpChange >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
              {match_summary.lpChange && match_summary.lpChange >= 0 ? "+" : ""}{match_summary.lpChange ?? 0}점
            </div>
          </div>

          {/* 3. KDA */}
          <div className="w-28 shrink-0 flex flex-col items-center">
            <div className="font-bold text-xs leading-none mb-0.5">
              {personal_stats.kda.kills} <span className="text-gray-300 mx-0.2">/</span> <span className="text-brand-lose">{personal_stats.kda.deaths}</span> <span className="text-gray-300 mx-0.2">/</span> {personal_stats.kda.assists}
            </div>
            <div className={`${getKdaColorClass(personal_stats.kda_ratio)} text-[8px] font-bold px-1.5 py-0.5`}>
              ({personal_stats.kda_ratio.toFixed(1)}%)
            </div>
          </div>

          {/* 4. Clan Info VS */}
          <div className="flex-1 min-w-0 flex items-center justify-center gap-2">
            <Link
              href={`/clan/${myTeam.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 max-w-[45%] hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={myTeam.team_name}
                clanMarkUrl={myTeam.clanMarkUrl}
                clanBackMarkUrl={myTeam.clanBackMarkUrl}
                size="sm"
                className="w-3 h-3 shrink-0"
              />
              <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                {myTeam.team_name}
              </span>
            </Link>

            <div className="text-[9px] font-black text-gray-400 shrink-0">VS</div>

            <Link
              href={`/clan/${enemyTeam.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 max-w-[45%] hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={enemyTeam.team_name}
                clanMarkUrl={enemyTeam.clanMarkUrl}
                clanBackMarkUrl={enemyTeam.clanBackMarkUrl}
                size="sm"
                className="w-3 h-3 shrink-0"
              />
              <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                {enemyTeam.team_name}
              </span>
            </Link>
          </div>

          {/* Chevron */}
          <div className="ml-1 shrink-0">
            <i
              className={`fas fa-chevron-down text-gray-300 transition-transform duration-300 text-xs ${
                isExpanded ? "rotate-180" : ""
              }`}
            ></i>
          </div>
        </div>
      </div>

      {/* Summarized View - Desktop Layout (md 이상) */}
      <div className="hidden md:flex pl-3 sm:pl-4 pr-2 py-1.5 items-center justify-between gap-1 sm:gap-2 md:gap-4 overflow-hidden relative z-10">
        {/* 1. Match Info */}
        <div className="w-16 sm:w-20 md:w-24 shrink-0 flex flex-col items-center">
          <div className="font-bold text-[11px] sm:text-[13px] text-gray-900 dark:text-white mb-0.5 truncate w-full text-center">
            {match_summary.map_name}
          </div>
          <div className={`font-bold text-xs sm:text-sm mb-0.5 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
            {match_summary.result}
          </div>
          <div className="text-[9px] sm:text-[11px] text-gray-400">
            {match_summary.timestamp_relative}
          </div>
        </div>

        {/* 2. Ladder Points */}
        <div className="w-12 sm:w-16 md:w-20 shrink-0 flex flex-col items-center">
          <div className="text-[9px] sm:text-[11px] font-bold text-gray-800 dark:text-gray-200 mb-0.5">래더</div>
          <div className={`font-bold text-xs sm:text-sm ${isDraw ? "text-gray-500 dark:text-gray-400" : match_summary.lpChange && match_summary.lpChange >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
            {match_summary.lpChange && match_summary.lpChange >= 0 ? "+" : ""}{match_summary.lpChange ?? 0}점
          </div>
        </div>

        {/* 3. KDA */}
        <div className="w-24 sm:w-32 md:w-40 shrink-0 flex flex-col items-center">
          <div className="font-bold text-xs sm:text-[15px] md:text-[17px] leading-none mb-0.5">
            {personal_stats.kda.kills} <span className="text-gray-300 mx-0.2 sm:mx-0.5">/</span> <span className="text-brand-lose">{personal_stats.kda.deaths}</span> <span className="text-gray-300 mx-0.2 sm:mx-0.5">/</span> {personal_stats.kda.assists}
          </div>
          <div className={`${getKdaColorClass(personal_stats.kda_ratio)} text-[8px] sm:text-[10px] md:text-[11px] font-bold px-1.5 sm:px-2 py-0.5`}>
            ({personal_stats.kda_ratio.toFixed(1)}%)
          </div>
        </div>

        {/* 4. Clan Info VS */}
        <div className="flex-1 min-w-0 max-w-100 flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
          {/* My Team */}
          <div className="flex flex-col items-end gap-0.5 min-w-0 flex-1">
            <Link
              href={`/clan/${myTeam.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 max-w-full hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={myTeam.team_name}
                clanMarkUrl={myTeam.clanMarkUrl}
                clanBackMarkUrl={myTeam.clanBackMarkUrl}
                size="sm"
                className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 shrink-0"
              />
              <span className="font-bold text-xs sm:text-[14px] md:text-[15px] truncate hover:underline">
                {myTeam.team_name}
              </span>
            </Link>
            <div className="text-[9px] sm:text-[11px] md:text-[12px] text-gray-500 font-bold truncate w-full text-right">
              {myTeam.division}부 {myTeam.clanLadderPoint != null ? formatLadderPoint(myTeam.clanLadderPoint) : ""}
            </div>
          </div>

          <div className="text-[9px] sm:text-[11px] font-black text-gray-400 shrink-0">VS</div>

          {/* Enemy Team */}
          <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
            <Link
              href={`/clan/${enemyTeam.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 max-w-full hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={enemyTeam.team_name}
                clanMarkUrl={enemyTeam.clanMarkUrl}
                clanBackMarkUrl={enemyTeam.clanBackMarkUrl}
                size="sm"
                className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 shrink-0"
              />
              <span className="font-bold text-xs sm:text-[14px] md:text-[15px] truncate hover:underline">
                {enemyTeam.team_name}
              </span>
            </Link>
            <div className="text-[9px] sm:text-[11px] md:text-[12px] text-gray-500 font-bold truncate w-full text-left">
              {enemyTeam.division}부 {enemyTeam.clanLadderPoint != null ? formatLadderPoint(enemyTeam.clanLadderPoint) : ""}
            </div>
          </div>
        </div>

        {/* 5. Participant List (5 vs 5) */}
        <div className="hidden md:flex items-stretch shrink-0 w-32 sm:w-48 md:w-56 lg:w-64 h-23">
          <div className="grid grid-cols-2 gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 content-between w-full h-full">
            {Array.from({ length: Math.max(myTeam.players.length, enemyTeam.players.length) }).map((_, i) => {
              const myPlayer = myTeam.players[i];
              const enemyPlayer = enemyTeam.players[i];
              return (
                <div key={i} className="contents text-[9px] sm:text-[10px] md:text-[11px]">
                  <div className="flex items-center gap-0.5 sm:gap-1 overflow-hidden">
                    {myPlayer ? (
                      <>
                        <ClanLogo
                          clanName={myPlayer.clanName || ""}
                          clanMarkUrl={myPlayer.clanMarkUrl}
                          clanBackMarkUrl={myPlayer.clanBackMarkUrl}
                          size="sm"
                          className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0"
                        />
                        <Link
                          href={`/user/${myPlayer.nexonOuId ?? myPlayer.playerId}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`truncate font-bold hover:underline ${
                            myPlayer.is_self
                              ? isWin
                                ? "text-brand-win"
                                : "text-brand-lose"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {myPlayer.nickname}
                        </Link>
                        {myPlayer.role === "S" && (
                          <span className="text-red-500 font-bold shrink-0 text-[8px] sm:text-[9px]">[S]</span>
                        )}
                      </>
                    ) : <div className="h-3 sm:h-3.5" />}
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 overflow-hidden">
                    {enemyPlayer ? (
                      <>
                        <ClanLogo
                          clanName={enemyPlayer.clanName || ""}
                          clanMarkUrl={enemyPlayer.clanMarkUrl}
                          clanBackMarkUrl={enemyPlayer.clanBackMarkUrl}
                          size="sm"
                          className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0"
                        />
                        <Link
                          href={`/user/${enemyPlayer.nexonOuId ?? enemyPlayer.playerId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="truncate font-bold text-gray-700 dark:text-gray-300 hover:underline"
                        >
                          {enemyPlayer.nickname}
                        </Link>
                        {enemyPlayer.role === "S" && (
                          <span className="text-red-500 font-bold shrink-0 text-[8px] sm:text-[9px]">[S]</span>
                        )}
                      </>
                    ) : <div className="h-3 sm:h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chevron */}
        <div className="ml-1 sm:ml-2 shrink-0">
          <i
            className={`fas fa-chevron-down text-gray-300 transition-transform duration-300 text-xs sm:text-sm ${
              isExpanded ? "rotate-180" : ""
            }`}
          ></i>
        </div>
      </div>

      {/* Expanded Detail Section */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-brand-900/50 border-t border-gray-200 dark:border-gray-700 p-2 md:p-4">
          {detailsLoaded && detailData ? (
            <div className="space-y-4">
              {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const maxDamage = Math.max(...detailData.teams.flatMap(team => team.players.map(p => p.damage || 0)), 1);
                  
                  return [...detailData.teams].sort((a) => a.side === "BLUE" ? -1 : 1).map((team, teamIdx) => (
                    <div
                      key={teamIdx}
                      className={`p-2 md:p-4 border ${
                        team.result === "승리"
                          ? "bg-brand-win-light/30 dark:bg-brand-win/10 border-brand-win/20 dark:border-brand-win/30"
                          : team.result === "무승부"
                          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                          : "bg-brand-lose-light/30 dark:bg-brand-lose/10 border-brand-lose/20 dark:border-brand-lose/30"
                      }`}
                    >
                      {/* Team Header */}
                      <div className={`flex items-center gap-2 -mx-2 md:-mx-4 -mt-2 md:-mt-4 mb-4 px-3 md:px-4 py-3 border-b ${
                        team.result === "승리"
                          ? "bg-brand-win-light/30 dark:bg-brand-win/10 border-brand-win/20 dark:border-brand-win/30"
                          : team.result === "무승부"
                          ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                          : "bg-brand-lose-light/30 dark:bg-brand-lose/10 border-brand-lose/20 dark:border-brand-lose/30"
                      }`}>
                        <Link
                          href={`/clan/${teams.find(t => t.team_name === team.team_name)?.clanId}`}
                          className="flex items-center gap-3 hover:opacity-80 transition"
                        >
                          <ClanLogo
                            clanName={team.team_name}
                            clanMarkUrl={team.clanMarkUrl}
                            clanBackMarkUrl={team.clanBackMarkUrl}
                            size="sm"
                            className="w-6 h-6 shadow-sm border border-white/50 dark:border-gray-700/50"
                          />
                          <h4 className="text-base font-black text-gray-900 dark:text-white">
                            {team.team_name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-xs font-black shadow-sm ${
                              team.result === "승리"
                                ? "bg-brand-win text-white"
                                : team.result === "무승부"
                                ? "bg-gray-400 text-white"
                                : "bg-brand-lose text-white"
                            }`}
                          >
                            {team.result}
                          </span>
                        </div>
                      </div>

                      {/* Team Info */}
                      <div className="flex items-center gap-3 mb-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            선{team.side === "RED" ? "레드" : "블루"}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white">
                            {team.division}부리그 {team.clanLadderPoint != null ? formatLadderPoint(team.clanLadderPoint) : ""}
                          </span>
                        </div>
                      </div>

                      {/* Players Table */}
                      <div className="w-full overflow-x-auto scrollbar-hide">
                        <table className="w-full text-xs table-fixed">
                          <thead>
                            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600">
                              <th className="py-2 text-left font-bold w-[38%] px-1 text-[11px]">플레이어</th>
                              <th className="py-2 text-center font-bold w-[12%] px-0.5 text-[11px]">래더</th>
                              <th className="py-2 text-center font-bold w-[24%] px-0.5 text-[11px]">KDA</th>
                              <th className="py-2 text-center font-bold w-[14%] px-0.5 text-[11px]">무기</th>
                              <th className="py-2 text-center font-bold w-[12%] px-0.5 text-[11px]">딜량</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 dark:text-gray-300">
                            {team.players.map((player, playerIdx) => (
                              <tr
                                key={playerIdx}
                                className={`border-b border-gray-200 dark:border-gray-600 ${
                                  player.is_self
                                    ? team.result === "승리"
                                      ? "bg-brand-win-light/60 dark:bg-brand-win/30"
                                      : team.result === "무승부"
                                      ? "bg-gray-100 dark:bg-gray-700/30"
                                      : "bg-brand-lose-light/60 dark:bg-brand-lose/30"
                                    : ""
                                }`}
                              >
                                <td className="py-2.5 px-1 min-w-0 font-bold">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <ClanLogo
                                      clanName={player.clanName || ""}
                                      clanMarkUrl={player.clanMarkUrl}
                                      clanBackMarkUrl={player.clanBackMarkUrl}
                                      size="sm"
                                      className="w-4 h-4 shrink-0"
                                    />
                                    <Link
                                      href={`/user/${player.nexonOuId ?? player.playerId}`}
                                      className={`font-bold truncate hover:underline cursor-pointer ${
                                        player.is_self
                                          ? team.result === "승리"
                                            ? "text-blue-700 dark:text-blue-300"
                                            : team.result === "무승부"
                                            ? "text-gray-600 dark:text-gray-400"
                                            : "text-red-700 dark:text-red-300"
                                          : "text-gray-900 dark:text-gray-100"
                                      }`}
                                    >
                                      {player.nickname}
                                    </Link>
                                    {player.is_mvp && (
                                      <span className="text-[10px] bg-yellow-500 text-white px-1 py-0.5 font-bold shrink-0">
                                        MVP
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 text-center px-0.5 font-bold">
                                  <span className={`font-bold text-[11px] ${getLadderPointColorClass(player.points)}`}>
                                    {formatLadderPoint(player.points)}
                                  </span>
                                </td>
                                <td className="py-2.5 text-center px-0.5 font-bold">
                                  <div className="flex flex-col items-center leading-none gap-1">
                                    <div className="font-bold">
                                      <span className="text-gray-900 dark:text-white">{player.kda.kill}</span>
                                      <span className="text-gray-400 mx-0.5">/</span>
                                      <span className="text-brand-lose font-bold">{player.kda.death}</span>
                                      <span className="text-gray-400 mx-0.5">/</span>
                                      <span className="text-gray-900 dark:text-white">{player.kda.assist}</span>
                                    </div>
                                    <div className={`text-[10px] font-bold ${getKdaColorClass(calculateKDA(player.kda.kill, player.kda.death, player.kda.assist))}`}>
                                      {calculateKDA(player.kda.kill, player.kda.death, player.kda.assist).toFixed(1)}%
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 text-center px-0.5 font-bold">
                                  <span className={`text-[11px] font-bold py-0.5 whitespace-nowrap`}>
                                    {player.weaponType === "RIFLE" ? "라이플" : player.weaponType === "SNIPER" ? "스나이퍼" : "-"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-1 font-bold">
                                  <div className="flex flex-col gap-1 w-full items-center">
                                    <span className="text-[11px] text-gray-900 dark:text-white leading-none">
                                      {player.damage ? player.damage.toLocaleString() : "0"}
                                    </span>
                                    <div className={`w-full max-w-10 sm:max-w-none h-1 ${team.result === "승리" ? "bg-brand-win/10" : team.result === "무승부" ? "bg-gray-400/10" : "bg-brand-lose/10"} dark:bg-gray-700/50 overflow-hidden`}>
                                      <div
                                        className={`h-full transition-all duration-500 ${
                                          team.result === "승리" ? "bg-brand-win" : team.result === "무승부" ? "bg-gray-400" : "bg-brand-lose"
                                        }`}
                                        style={{ width: `${Math.min(((player.damage || 0) / maxDamage) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              상세 정보를 불러오는 중입니다...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
