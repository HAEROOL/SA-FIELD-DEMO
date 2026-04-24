"use client";

import { useTrendingPosts } from "@/hooks/queries/usePosts";
import { useRouter } from "next/navigation";
import TimeAgo from "@/components/common/TimeAgo";

export default function TrendingPosts() {
  const router = useRouter();
  const { data } = useTrendingPosts(0, 3); // 상위 3개만 가져오기
  const posts = data?.posts.content || [];

  // 게시판 타입을 한글 라벨로 변환 (API에서 boardDesc가 한글로 옴)
  const getBoardLabel = (boardDesc: string) => {
    // boardDesc가 이미 "랭크전", "대룰", "자유" 등으로 옴
    // 색상 매핑만 처리
    const colorMap: Record<string, string> = {
      "대룰": "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
      "랭크전": "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
      "3부": "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400",
      "A보급": "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
      "자유": "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
      "방송": "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400",
      "전략": "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    };

    return {
        text: boardDesc,
        color: colorMap[boardDesc] || colorMap["자유"] // 기본값 자유
    };
  };

  // 조회수를 포맷팅하는 함수
  const formatViewCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 p-0 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center">
          <i className="fas fa-fire text-brand-500 mr-2"></i>인기 게시글
        </h3>
        <button
           onClick={() => router.push('/board')} 
           className="text-xs text-gray-400 hover:text-brand-500 transition-colors"
        >
          전체보기 <i className="fas fa-chevron-right text-[10px] ml-1"></i>
        </button>
      </div>

      {/* List */}
      <div className="p-0">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fas fa-inbox text-4xl mb-3 opacity-30"></i>
            <p>인기 게시글이 없습니다</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            {posts.map((post) => {
              const boardLabel = getBoardLabel(post.boardDesc);
              return (
                <li
                  key={post.postId}
                  onClick={() => router.push(`/board/${post.postId}`)}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between group gap-2 md:gap-0"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto md:flex-1 md:pr-4 min-w-0">
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 transition-colors">
                      {post.title}
                    </span>
                    <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-bold border border-current opacity-70 ${boardLabel.color.replace('bg-', 'text-').split(' ')[0]}`}>
                        {boardLabel.text}
                    </span>
                    {/* New Badge or similar could go here */}
                  </div>

                  <div className="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400 w-full md:w-auto shrink-0 md:ml-auto">
                    <span className="flex items-center w-20 truncate justify-end" title="작성자">
                        <i className="fas fa-user mr-1 text-[10px] opacity-70"></i>
                        {post.authorName}
                    </span>
                    <span className="w-14 text-center" title="작성일">
                       <TimeAgo date={post.createdAt} format="ago" />
                    </span>
                    <span className="flex items-center justify-center w-12" title="조회수">
                        <i className="fas fa-eye mr-1 text-[10px] opacity-70"></i>
                        {formatViewCount(post.viewCount)}
                    </span>
                    <span className="flex items-center justify-end w-10" title="추천">
                         <i className="fas fa-thumbs-up mr-1 text-[10px] text-brand-500"></i>
                         <span className="text-brand-500 font-bold">{post.likeCount}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
