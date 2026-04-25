export default function DemoBanner() {
  return (
    <div
      role="note"
      aria-label="데모 환경 안내"
      className="w-full bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm"
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-6 py-2 flex items-center justify-center gap-2 text-center">
        <i className="fas fa-info-circle text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />
        <span>
          본 페이지는 <strong className="font-semibold">데모 환경</strong>입니다. 표시되는 모든 데이터(클랜·플레이어·전적·게시글 등)는 시연용으로 임의 생성된 가상 정보이며, 실제 게임 데이터와 무관합니다.
        </span>
      </div>
    </div>
  );
}
