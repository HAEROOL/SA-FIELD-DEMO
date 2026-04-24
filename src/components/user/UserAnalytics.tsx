export default function UserAnalytics() {
  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-10 flex flex-col items-center justify-center text-center shadow-sm">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 text-gray-400">
        <i className="fas fa-chart-line text-3xl"></i>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        개인 상세 통계 분석
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        시간대별 K/D, 맵별 승률 추이 등 상세 데이터가 준비 중입니다.
      </p>
    </div>
  );
}
