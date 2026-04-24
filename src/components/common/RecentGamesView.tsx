import { ClanLogo } from "@/components/ui/ClanLogo";
import { getKdaColorClass } from "@/utils/stats";

export interface OpponentStatView {
  clanName: string;
  clanMarkUrl: string | null;
  clanBackMarkUrl?: string | null;
  totalGames: number;
  wins: number;
  losses: number;
  kdRatio: string;
  winRate: string;
  kills: number;
  deaths: number;
}

export interface RecentMatchKD {
  result: "W" | "L";
  kills: number;
  deaths: number;
  assists: number;
}

interface RecentGamesViewProps {
  total: number;
  wins: number;
  losses: number;
  winRate: string;
  isWinStreak: boolean;
  currentStreak: number;
  opponentList: OpponentStatView[];
  recentMatches?: RecentMatchKD[];
  showKd?: boolean;
  loading?: boolean;
  error?: boolean;
}

export default function RecentGamesView({
  total,
  wins,
  losses,
  winRate,
  isWinStreak,
  currentStreak,
  opponentList,
  recentMatches = [],
  showKd = true,
  loading = false,
  error = false,
}: RecentGamesViewProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm animate-pulse h-40"></div>
    );
  }

  if (error || total === 0) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-4">
          최근매치
        </h3>
        <div className="text-center text-gray-500 py-8">
          최근 기록된 게임이 없습니다.
        </div>
      </div>
    );
  }

  const winAngle = (wins / total) * 360;

  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm overflow-hidden flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-3 lg:gap-4 items-center h-full">
        {/* Left: Chart & Stats */}
        <div className="flex items-center gap-3 md:gap-2 lg:gap-4 shrink-0">
          {/* Chart */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="transform -rotate-90 w-full h-full"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-brand-lose"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${(winAngle / 360) * 251.2} 251.2`}
                className="text-brand-win transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white">
                {winRate}%
              </span>
            </div>
          </div>

          {/* Text Stats */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-white mb-1">
              최근매치
            </h3>
            <div className="text-[11px] sm:text-xs lg:text-[14px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 whitespace-nowrap">
              {total}전 {wins}승 {losses}패{" "}
              <span className="text-brand-death">({winRate}%)</span>
            </div>
            <div
              className={`text-[10px] sm:text-xs font-bold ${
                isWinStreak ? "text-brand-win" : "text-brand-lose"
              }`}
            >
              {currentStreak}
              {isWinStreak ? "연승" : "연패"} 중
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 h-16 lg:h-20 self-center mx-1 lg:mx-2 shrink-0"></div>

        <div className="flex-1 w-full space-y-1.5 md:space-y-2 min-w-0">
          {opponentList.map((opp, idx) => {
            const winRateValue = parseFloat(opp.winRate);
            const winRateColor = winRateValue >= 50 ? "text-brand-win" : "text-brand-lose";

            return (
              <div
                key={idx}
                className="flex items-center justify-between w-full"
              >
                {/* Left Group: vs, Logo, Record */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                  <span className="text-[9px] text-gray-400 w-3 shrink-0 text-center font-bold">
                    vs
                  </span>
                  
                  {/* Logo */}
                  <ClanLogo
                    clanName={opp.clanName}
                    clanMarkUrl={opp.clanMarkUrl}
                    clanBackMarkUrl={opp.clanBackMarkUrl}
                    size="sm"
                    className="w-7 h-7 sm:w-8 sm:h-8"
                  />

                  {/* Name & Record */}
                  <div className="flex flex-col justify-center min-w-0 flex-1 leading-none ml-1">
                    <span className="text-[11px] sm:text-xs font-bold text-gray-900 dark:text-white truncate">
                      {opp.clanName}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 font-bold">
                        <span>{opp.totalGames}전 {opp.wins}승 {opp.losses}패</span>
                        <span className={`${winRateColor}`}>({opp.winRate}%)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Personal KD against this clan */}
                {showKd && (
                <div className="shrink-0 flex flex-col items-end leading-none">
                    <span className="text-[10px] text-gray-400 font-bold mb-0.5">K/D</span>
                    <span className={`text-[11px] sm:text-xs font-black ${getKdaColorClass(parseFloat(opp.kdRatio))}`}>
                        {opp.kdRatio}%
                    </span>
                </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
