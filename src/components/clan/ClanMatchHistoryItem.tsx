"use client";

import { ClanMatch } from "@/apis/types/clan.type";
import { ClanLogo } from "@/components/ui/ClanLogo";
import { calculateKDA, formatLadderPoint, getKdaColorClass, getLadderPointColorClass } from "@/utils/stats";
import Link from "next/link";
import { getRelativeTime } from "@/utils/date";

interface ClanMatchHistoryItemProps {
  match: ClanMatch;
  myClanId: number;
  isExpanded: boolean;
  onToggle: () => void;
}


export default function ClanMatchHistoryItem({
  match,
  myClanId,
  isExpanded,
  onToggle,
}: ClanMatchHistoryItemProps) {
  // 1. Identify My Team vs Enemy Team based on ClanMatch data
  const isMyClanRed = match.clanRed === myClanId;

  // 2. Determine Win/Loss
  const isWin = match.winnerClanId === myClanId;
  const isDraw = match.winnerClanId === null;
  const resultText = isWin ? "승리" : isDraw ? "무승부" : "패배";

  const { bgColor, borderColor } = getResultStyles(resultText);

  // 3. Group Participants by Team
  const redTeamPlayers = match.participants.filter(
    (p) => p.teamSide === "RED"
  );
  const blueTeamPlayers = match.participants.filter(
    (p) => p.teamSide === "BLUE"
  );

  const myTeamPlayers = isMyClanRed ? redTeamPlayers : blueTeamPlayers;
  const enemyTeamPlayers = isMyClanRed ? blueTeamPlayers : redTeamPlayers;

  // 4. Detailed Team Data for Expanded View
  const teamRed = {
    clanId: match.clanRed,
    name: match.clanRedName,
    markUrl: match.clanRedMarkUrl,
    backMarkUrl: match.clanRedBackMarkUrl,
    division: match.clanRedDivision,
    ladderPoint: match.clanRedLadderPoint,
    result:
      match.winnerClanId === match.clanRed
        ? "승리"
        : match.winnerClanId === null
        ? "무승부"
        : "패배",
    side: "RED",
    score: match.scoreRed,
    players: redTeamPlayers,
  };

  const teamBlue = {
    clanId: match.clanBlue,
    name: match.clanBlueName,
    markUrl: match.clanBlueMarkUrl,
    backMarkUrl: match.clanBlueBackMarkUrl,
    division: match.clanBlueDivision,
    ladderPoint: match.clanBlueLadderPoint,
    result:
      match.winnerClanId === match.clanBlue
        ? "승리"
        : match.winnerClanId === null
        ? "무승부"
        : "패배",
    side: "BLUE",
    score: match.scoreBlue,
    players: blueTeamPlayers,
  };

  // 5. Determine Left/Right for Display (Current Clan always on Left)
  const summarizedLeftClan = isMyClanRed ? teamRed : teamBlue;
  const summarizedRightClan = isMyClanRed ? teamBlue : teamRed;

  return (
    <div
      className={`relative ${bgColor} border ${borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden`}
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
              {match.matchMap || "맵 정보 없음"}
            </span>
            <span className="text-gray-400 text-xs">-</span>
            <span className="text-[10px] text-gray-400 shrink-0">
              {getRelativeTime(match.matchDate)}
            </span>
          </div>
          <div className={`font-bold text-xs shrink-0 ${isDraw ? "text-gray-500 dark:text-gray-400" : match.changePoints && match.changePoints >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
            {match.changePoints && match.changePoints >= 0 ? "+" : ""}{match.changePoints ?? 0}점
          </div>
        </div>

        {/* Row 2: 승리/패배 + 클랜 vs 클랜 (일직선) */}
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm shrink-0 w-8 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
            {resultText}
          </span>
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex items-center justify-end gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${summarizedLeftClan.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={summarizedLeftClan.name}
                  clanMarkUrl={summarizedLeftClan.markUrl}
                  clanBackMarkUrl={summarizedLeftClan.backMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {summarizedLeftClan.name}
                </span>
              </Link>
            </div>
            <span className="text-[10px] font-bold text-gray-400 shrink-0 px-1.5">vs</span>
            <div className="flex items-center justify-start gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${summarizedRightClan.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={summarizedRightClan.name}
                  clanMarkUrl={summarizedRightClan.markUrl}
                  clanBackMarkUrl={summarizedRightClan.backMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {summarizedRightClan.name}
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
              {match.matchMap || "맵 정보 없음"}
            </div>
            <div className={`font-bold text-xs mb-0.5 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
              {resultText}
            </div>
            <div className="text-[9px] text-gray-400">
              {getRelativeTime(match.matchDate || match.createAt)}
            </div>
          </div>

          {/* 2. Ladder Points */}
          <div className="w-14 shrink-0 flex flex-col items-center">
            <div className="text-[9px] font-bold text-gray-800 dark:text-gray-200 mb-0.5">래더</div>
            <div className={`font-bold text-xs ${isDraw ? "text-gray-500 dark:text-gray-400" : match.changePoints && match.changePoints >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
              {match.changePoints && match.changePoints >= 0 ? "+" : ""}{match.changePoints ?? 0}점
            </div>
          </div>

          {/* 3. Clan Info VS */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex items-center justify-end gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${summarizedLeftClan.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={summarizedLeftClan.name}
                  clanMarkUrl={summarizedLeftClan.markUrl}
                  clanBackMarkUrl={summarizedLeftClan.backMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {summarizedLeftClan.name}
                </span>
              </Link>
            </div>

            <span className="text-[10px] font-bold text-gray-400 shrink-0 px-1.5">vs</span>

            <div className="flex items-center justify-start gap-0.5 flex-1 min-w-0">
              <Link
                href={`/clan/${summarizedRightClan.clanId}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-0.5 hover:opacity-80 transition max-w-full"
              >
                <ClanLogo
                  clanName={summarizedRightClan.name}
                  clanMarkUrl={summarizedRightClan.markUrl}
                  clanBackMarkUrl={summarizedRightClan.backMarkUrl}
                  size="sm"
                  className="w-3 h-3 shrink-0"
                />
                <span className="font-bold text-[10px] truncate hover:underline text-gray-900 dark:text-white">
                  {summarizedRightClan.name}
                </span>
              </Link>
            </div>
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
            {match.matchMap || "맵 정보 없음"}
          </div>
          <div className={`font-bold text-xs sm:text-sm mb-0.5 ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
            {resultText}
          </div>
          <div className="text-[9px] sm:text-[11px] text-gray-400">
            {getRelativeTime(match.matchDate || match.createAt)}
          </div>
        </div>

        {/* 2. Ladder Points */}
        <div className="w-12 sm:w-16 md:w-20 shrink-0 flex flex-col items-center">
          <div className="text-[9px] sm:text-[11px] font-bold text-gray-800 dark:text-gray-200 mb-0.5">래더</div>
          <div className={`font-bold text-xs sm:text-sm ${isDraw ? "text-gray-500 dark:text-gray-400" : match.changePoints && match.changePoints >= 0 ? "text-brand-win" : "text-brand-lose"}`}>
            {match.changePoints && match.changePoints >= 0 ? "+" : ""}{match.changePoints ?? 0}점
          </div>
        </div>

        {/* 3. Clan Info VS */}
        <div className="flex-1 min-w-0 max-w-100 flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
          {/* Left Clan (Me) */}
          <div className="flex flex-col items-end gap-0.5 min-w-0 flex-1">
            <Link
              href={`/clan/${summarizedLeftClan.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 max-w-full hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={summarizedLeftClan.name}
                clanMarkUrl={summarizedLeftClan.markUrl}
                clanBackMarkUrl={summarizedLeftClan.backMarkUrl}
                size="sm"
                className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 shrink-0"
              />
              <span className="font-bold text-xs sm:text-[14px] md:text-[15px] truncate hover:underline">
                {summarizedLeftClan.name}
              </span>
            </Link>
            <div className="text-[9px] sm:text-[11px] md:text-[12px] text-gray-500 font-bold truncate w-full text-right">
              {summarizedLeftClan.division}부 {summarizedLeftClan.ladderPoint != null ? formatLadderPoint(summarizedLeftClan.ladderPoint) : ""}
            </div>
          </div>

          <div className="text-[9px] sm:text-[11px] font-black text-gray-400 shrink-0">VS</div>

          {/* Right Clan (Enemy) */}
          <div className="flex flex-col items-start gap-0.5 min-w-0 flex-1">
            <Link
              href={`/clan/${summarizedRightClan.clanId}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 max-w-full hover:opacity-80 transition"
            >
              <ClanLogo
                clanName={summarizedRightClan.name}
                clanMarkUrl={summarizedRightClan.markUrl}
                clanBackMarkUrl={summarizedRightClan.backMarkUrl}
                size="sm"
                className="w-2 h-2 sm:w-4 sm:h-4 md:w-6 md:h-6 shrink-0"
              />
              <span className="font-bold text-xs sm:text-[14px] md:text-[15px] truncate hover:underline">
                {summarizedRightClan.name}
              </span>
            </Link>
            <div className="text-[9px] sm:text-[11px] md:text-[12px] text-gray-500 font-bold truncate w-full text-left">
              {summarizedRightClan.division}부 {summarizedRightClan.ladderPoint != null ? formatLadderPoint(summarizedRightClan.ladderPoint) : ""}
            </div>
          </div>
        </div>

        {/* 4. Side Info */}
        <div className="hidden md:flex w-16 sm:w-20 md:w-24 shrink-0 flex-col items-center">
          <div className={`font-bold text-xs sm:text-sm`}>
            선{isMyClanRed ? "레드" : "블루"}
          </div>
          <div className={`font-bold text-xs sm:text-sm ${isDraw ? "text-gray-500 dark:text-gray-400" : isWin ? "text-brand-win" : "text-brand-lose"}`}>
            {myTeamPlayers.length} VS {enemyTeamPlayers.length}
          </div>
        </div>

        {/* 5. Participant List (5 vs 5) */}
        <div className="hidden md:flex items-stretch shrink-0 w-32 sm:w-48 md:w-56 lg:w-64 h-23">
          <div className="grid grid-cols-2 gap-x-1 sm:gap-x-2 md:gap-x-3 lg:gap-x-4 content-between w-full h-full">
            {Array.from({ length: Math.max(myTeamPlayers.length, enemyTeamPlayers.length) }).map((_, i) => {
              const myPlayer = myTeamPlayers[i];
              const enemyPlayer = enemyTeamPlayers[i];

              return (
                <div key={i} className="contents text-[9px] sm:text-[10px] md:text-[11px]">
                  {/* Left Col (My Team) */}
                  <div className="flex items-center gap-0.5 sm:gap-1 overflow-hidden">
                    {myPlayer ? (
                      <>
                        <ClanLogo
                          clanName={myPlayer.nickname === "상대 없음" ? "" : (myPlayer.clanName || "")}
                          clanMarkUrl={myPlayer.clanMarkUrl}
                          clanBackMarkUrl={myPlayer.clanBackMarkUrl}
                          size="sm"
                          className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0"
                        />
                        <Link
                          href={`/user/${myPlayer.nexonOuId ?? myPlayer.playerId}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`truncate font-bold hover:underline ${
                            myPlayer.isMvp ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {myPlayer.nickname}
                        </Link>
                        {myPlayer.weaponType === "SNIPER" && <span className="text-red-500 font-bold shrink-0 text-[8px] sm:text-[9px]">[S]</span>}
                      </>
                    ) : (
                      <div className="h-3 sm:h-3.5"></div>
                    )}
                  </div>

                  {/* Right Col (Enemy Team) */}
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
                          className={`truncate font-bold hover:underline ${
                            enemyPlayer.isMvp ? 'text-yellow-600' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {enemyPlayer.nickname}
                        </Link>
                        {enemyPlayer.weaponType === "SNIPER" && <span className="text-red-500 font-bold shrink-0 text-[8px] sm:text-[9px]">[S]</span>}
                      </>
                    ) : (
                      <div className="h-3 sm:h-3.5"></div>
                    )}
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
          <div className="space-y-4">
            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const maxDamage = Math.max(...match.participants.map(p => p.damage || 0), 1);
                
                const displayTeams = isMyClanRed ? [teamRed, teamBlue] : [teamBlue, teamRed];
                
                return displayTeams.map((team, teamIdx) => (
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
                        href={`/clan/${team.clanId}`}
                        className="flex items-center gap-3 hover:opacity-80 transition"
                      >
                        <ClanLogo
                          clanName={team.name}
                          clanMarkUrl={team.markUrl}
                          clanBackMarkUrl={team.backMarkUrl}
                          size="sm"
                          className="w-6 h-6 shadow-sm border border-white/50 dark:border-gray-700/50"
                        />
                        <h4 className="text-base font-black text-gray-900 dark:text-white">
                          {team.name}
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
                          {team.division}부리그 {team.ladderPoint != null ? formatLadderPoint(team.ladderPoint) : ""}
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
                                player.isMvp
                                  ? "bg-yellow-50 dark:bg-yellow-900/10"
                                  : ""
                              }`}
                            >
                              <td className="py-2.5 px-1 truncate font-bold">
                                <div className="flex flex-col gap-0.5 truncate">
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
                                      className="font-bold truncate text-gray-900 dark:text-gray-100 hover:underline cursor-pointer"
                                    >
                                      {player.nickname}
                                    </Link>
                                    {player.isMvp && (
                                      <span className="text-[10px] bg-yellow-500 text-white px-1 py-0.5 font-bold shrink-0">
                                        MVP
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 text-center px-0.5 font-bold">
                                <span className={`text-[11px] font-bold ${getLadderPointColorClass(player.playerLadderPoint ?? 0)}`}>
                                  {player.playerLadderPoint != null ? formatLadderPoint(player.playerLadderPoint) : "-"}
                                </span>
                              </td>
                              <td className="py-2.5 text-center px-0.5 font-bold">
                                <div className="flex flex-col items-center leading-none gap-1">
                                  <div className="font-bold">
                                    <span className="text-gray-900 dark:text-white">
                                      {player.kills}
                                    </span>
                                    <span className="text-gray-400 mx-0.5">/</span>
                                    <span className="text-brand-lose font-bold">
                                      {player.deaths}
                                    </span>
                                    <span className="text-gray-400 mx-0.5">/</span>
                                    <span className="text-gray-900 dark:text-white">
                                      {player.assists}
                                    </span>
                                  </div>
                                  <div
                                    className={`text-[10px] font-bold ${getKdaColorClass(calculateKDA(player.kills, player.deaths, player.assists))}`}
                                  >
                                    {calculateKDA(player.kills, player.deaths, player.assists).toFixed(1)}%
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
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getResultStyles(result: string) {
  switch (result) {
    case "승리":
      return {
        bgColor: "bg-brand-win-light/40 dark:bg-brand-win/10",
        borderColor: "border-brand-win/20 dark:border-brand-win/30",
        resultColor: "text-brand-win",
        resultBgColor: "bg-brand-win/10",
      };
    case "패배":
      return {
        bgColor: "bg-brand-lose-light/40 dark:bg-brand-lose/10",
        borderColor: "border-brand-lose/20 dark:border-brand-lose/30",
        resultColor: "text-brand-lose",
        resultBgColor: "bg-brand-lose/10",
      };
    default:
      return {
        bgColor: "bg-gray-50 dark:bg-gray-800/50",
        borderColor: "border-gray-200 dark:border-gray-700",
        resultColor: "text-gray-600",
        resultBgColor: "bg-gray-200",
      };
  }
}
