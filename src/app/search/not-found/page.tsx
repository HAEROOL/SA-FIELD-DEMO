import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchNotFoundPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query as string;
  const type = resolvedParams.type as string;

  const typeText = type === "player" ? "플레이어" : "클랜";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-gray-100 dark:bg-brand-800/50 p-6 rounded-full mb-6">
        <i className="fas fa-search fa-3x text-gray-400 dark:text-gray-500"></i>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        검색 결과가 없어요
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md break-keep">
        <span className="font-bold text-brand-600 dark:text-brand-400">
          &#39;{query}&#39;
        </span>
        에 해당하는 {typeText}이(가) 없습니다.
        <br />
        검색어를 다시 한번 확인해주세요.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/30 flex items-center gap-2"
      >
        <i className="fas fa-home"></i>
        메인으로 돌아가기
      </Link>
    </div>
  );
}
