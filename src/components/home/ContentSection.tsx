import AsyncBoundary from "../common/AsyncBoundary";
import LeagueRanking from "./LeagueRanking";
import TrendingPosts from "./TrendingPosts";

export default function ContentSection() {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Community / Issues */}
        <div className="w-full lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-fire text-brand-500"></i> 인기 게시글
            </h2>
          </div>

          <AsyncBoundary>
            <TrendingPosts />
          </AsyncBoundary>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-1/3">
          {/* League Ranking */}
          <div className="mb-6">
            <AsyncBoundary>
              <LeagueRanking />
            </AsyncBoundary>
          </div>

          {/* Permanent Ban List - 현재 사용하지 않음 */}
          {/* <div className="bg-red-50 dark:bg-brand-800 border border-red-100 dark:border-red-900/30 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <i className="fas fa-ban"></i> 영구정지 제재 명단
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="min-w-[4px] h-[4px] bg-red-400 rounded-full mt-2"></span>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 block line-clamp-1 flex-1"
                >
                  12월 2주차 영구정지 제재 명단 안내
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-[4px] h-[4px] bg-red-400 rounded-full mt-2"></span>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 block line-clamp-1 flex-1"
                >
                  12월 1주차 영구정지 제재 명단 안내
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="min-w-[4px] h-[4px] bg-red-400 rounded-full mt-2"></span>
                <a
                  href="#"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 block line-clamp-1 flex-1"
                >
                  11월 4주차 영구정지 제재 명단 안내
                </a>
              </li>
              <li className="pt-2 text-xs text-right">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
                >
                  이전 공지 더보기
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </section>
  );
}
