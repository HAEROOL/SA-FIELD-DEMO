"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostResponseDto } from "@/apis/types/post.type";

interface BoardTableProps {
  posts: PostResponseDto[];
  isLoading?: boolean;
  /** 네비게이션 시 사용할 쿼리 파라미터 (예: popular, daerul 등) */
  currentBoardParam?: string;
  /** 인기게시판 등에서 사용하는 전역 번호 (페이지 반영) */
  startIndex?: number;
  /** 최상단에 고정될 공지사항 목록 */
  notices?: PostResponseDto[];
  /** 헤더 아래에 삽입할 검색바 슬롯 */
  searchBar?: React.ReactNode;
}

export default function BoardTable({
  posts,
  currentBoardParam = "popular",
  notices = [],
  searchBar,
}: BoardTableProps) {
  const router = useRouter();

  // 조회수를 포맷팅하는 함수
  const formatViewCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // 날짜를 포맷팅하는 함수 (오늘이면 시:분, 아니면 월.일)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString || new Date());
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(
      date.getDate()
    ).padStart(2, "0")}`;
  };

  // 게시판 이름과 아이콘 정보 가져오기
  const getBoardInfo = (boardId: string) => {
    const boards: Record<string, { label: string; icon: string }> = {
      popular: { label: "인기게시판", icon: "fa-fire" },
      daerul: { label: "대룰게시판", icon: "fa-crosshairs" },
      ranked: { label: "랭크전게시판", icon: "fa-trophy" },
      third: { label: "3부게시판", icon: "fa-users" },
      asupply: { label: "A보급게시판", icon: "fa-box" },
      free: { label: "자유게시판", icon: "fa-comment-dots" },
      broadcast: { label: "방송게시판", icon: "fa-broadcast-tower" },
      strategy: { label: "공략게시판", icon: "fa-chess" },
      notice: { label: "공지사항", icon: "fa-bullhorn" },
    };
    return boards[boardId] || { label: "게시판", icon: "fa-list" };
  };

  const boardInfo = getBoardInfo(currentBoardParam);

  if (posts.length === 0 && notices.length === 0) {
    return (
      <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700">
        {/* Dark Header */}
        <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center">
            <i className={`fas ${boardInfo.icon} text-brand-500 mr-2`}></i>
            {boardInfo.label}
          </h3>
          {currentBoardParam !== "popular" && currentBoardParam !== "notice" && (
            <Link
              href={`/board/write?type=${currentBoardParam}`}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-1.5 px-4 flex items-center gap-2 transition text-xs"
            >
              <i className="fas fa-pen text-[10px]"></i> <span>글쓰기</span>
            </Link>
          )}
        </div>
        {searchBar && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            {searchBar}
          </div>
        )}
        <div className="px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <i className="fas fa-inbox text-5xl text-gray-300 dark:text-gray-600"></i>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              게시글이 없습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 mb-6">
      {/* Dark Header */}
      <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center">
          <i className={`fas ${boardInfo.icon} text-brand-500 mr-2`}></i>
          {boardInfo.label}
        </h3>
        {currentBoardParam !== "popular" && currentBoardParam !== "notice" && (
          <Link
            href={`/board/write?type=${currentBoardParam}`}
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-1.5 px-4 flex items-center gap-2 transition text-xs"
          >
            <i className="fas fa-pen text-[10px]"></i> <span>글쓰기</span>
          </Link>
        )}
      </div>
      {searchBar && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          {searchBar}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-2 text-left pl-4 min-w-50">제목</th>
              <th className="py-2 text-center w-24">작성자</th>
              <th className="py-2 text-center w-16">작성일</th>
              <th className="py-2 text-center w-14">조회수</th>
              <th className="py-2 text-center w-20">추천/비추천</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-gray-300">
            {/* Notices Mapping */}
            {notices.map((notice) => (
              <tr
                key={`notice-${notice.postId}`}
                className="bg-brand-50 dark:bg-brand-900/20 transition cursor-pointer border-b border-gray-100 dark:border-gray-800"
                onClick={() =>
                  router.push(`/board/${notice.postId}?from=${currentBoardParam}`)
                }
              >
                <td className="py-3 pl-4 font-bold text-gray-900 dark:text-white max-w-0">
                  <div className="hover:text-brand-600 transition-colors flex items-center gap-1 overflow-hidden">
                    <span className="bg-brand-500 text-white px-1.5 py-0.5 text-[10px] font-bold shrink-0">공지</span>
                    <span className="inline-flex items-center gap-1 min-w-0">
                      <span className="truncate">{notice.title}</span>
                      {notice.hasImg && (
                        <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>
                      )}
                      {notice.commentCnt != null && notice.commentCnt > 0 && (
                        <span className="text-brand-500 text-xs font-bold shrink-0">[{notice.commentCnt}]</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center text-brand-500 font-bold">
                  {notice.authorName}
                </td>
                <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {formatDate(notice.createdAt)}
                </td>
                <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                  {formatViewCount(notice.viewCount)}
                </td>
                <td className="py-3 text-center text-xs">
                  <span className="text-brand-500 font-bold">
                      {notice.likeCount}
                  </span>{" "}
                  <span className="text-gray-300 mx-1">/</span>{" "}
                  <span className="text-gray-400">{notice.dislikeCount}</span>
                </td>
              </tr>
            ))}
            
            {/* Regular Posts Mapping */}
            {posts.map((post) => {
              const isNotice = post.boardDesc === "NOTICE";
              return (
                <tr
                  key={post.postId}
                  className={`${
                    isNotice
                      ? "bg-brand-50 dark:bg-brand-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  } transition cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0`}
                  onClick={() =>
                    router.push(`/board/${post.postId}?from=${currentBoardParam}`)
                  }
                >
                  <td
                    className={`py-3 pl-4 max-w-0 ${
                      isNotice
                        ? "font-bold text-gray-900 dark:text-white"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    <div className="hover:text-brand-600 transition-colors flex items-center gap-1 overflow-hidden">
                      {isNotice && (
                        <span className="bg-brand-500 text-white px-1.5 py-0.5 text-[10px] font-bold shrink-0">공지</span>
                      )}
                      <span className="inline-flex items-center gap-1 min-w-0">
                        <span className="truncate">{post.title}</span>
                        {post.hasImg && (
                          <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>
                        )}
                        {post.commentCnt != null && post.commentCnt > 0 && (
                          <span className="text-brand-500 text-xs font-bold shrink-0">[{post.commentCnt}]</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-3 text-center ${
                      isNotice
                        ? "text-brand-500 font-bold"
                        : "text-gray-900 dark:text-white font-medium"
                    }`}
                  >
                    {post.authorName}
                  </td>
                  <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
                    {formatViewCount(post.viewCount)}
                  </td>
                  <td className="py-3 text-center text-xs">
                    <span className="text-brand-500 font-bold">
                        {post.likeCount}
                    </span>{" "}
                    <span className="text-gray-300 mx-1">/</span>{" "}
                    <span className="text-gray-400">{post.dislikeCount}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (TrendingPosts Style) */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        
        {/* Notices Mapping for Mobile */}
        {notices.map((notice) => (
          <div
            key={`notice-${notice.postId}`}
            className="px-4 py-3 bg-brand-50 dark:bg-brand-900/20 cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between group gap-2 md:gap-0"
            onClick={() =>
              router.push(`/board/${notice.postId}?from=${currentBoardParam}`)
            }
          >
            <div className="flex items-center gap-1.5 w-full md:w-auto md:flex-1 md:pr-4 min-w-0">
              <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-brand-500 text-white">공지</span>
              <span className="font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                {notice.title}
              </span>
              {notice.hasImg && (
                <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>
              )}
              {notice.commentCnt != null && notice.commentCnt > 0 && (
                <span className="text-brand-500 text-xs font-bold shrink-0">[{notice.commentCnt}]</span>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400 w-full md:w-auto shrink-0 md:ml-auto">
               <span className="flex items-center w-20 truncate justify-end" title="작성자">
                  <i className="fas fa-user mr-1 text-[10px] opacity-70"></i>
                  {notice.authorName}
              </span>
              <span className="w-14 text-center" title="작성일">
                  {formatDate(notice.createdAt)}
              </span>
              <span className="flex items-center justify-center w-12" title="조회수">
                  <i className="fas fa-eye mr-1 text-[10px] opacity-70"></i>
                  {formatViewCount(notice.viewCount)}
              </span>
              <span className="flex items-center justify-end w-14 shrink-0 tabular-nums" title="추천/비추천">
                <i className="fas fa-thumbs-up mr-1 text-[10px] text-brand-500"></i>
                <span className="text-brand-500 font-bold">{notice.likeCount}</span>
                <span className="text-gray-300 mx-0.5">/</span>
                <span className="text-gray-400">{notice.dislikeCount}</span>
              </span>
            </div>
          </div>
        ))}

        {/* Regular Posts Mapping for Mobile */}
        {posts.map((post) => {
          const isNotice = post.boardDesc === "NOTICE";
          // Helper to get board label (inline or reused if common)
          const getBoardLabel = (boardDesc: string) => {
             // boardDesc가 이미 한글로 옴
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
                color: colorMap[boardDesc] || colorMap["자유"]
            };
          };

          const boardLabel = getBoardLabel(post.boardDesc);

          return (
            <div
              key={post.postId}
              className={`px-4 py-3 ${
                isNotice
                  ? "bg-brand-50 dark:bg-brand-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
              } cursor-pointer transition-colors flex flex-col md:flex-row md:items-center justify-between group gap-2 md:gap-0`}
              onClick={() =>
                router.push(`/board/${post.postId}?from=${currentBoardParam}`)
              }
            >
              <div className="flex items-center gap-1.5 w-full md:w-auto md:flex-1 md:pr-4 min-w-0">
                {isNotice ? (
                  <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-brand-500 text-white">공지</span>
                ) : (
                  <span className={`shrink-0 px-1.5 py-0.5 text-[10px] font-bold border border-current opacity-70 ${boardLabel.color.replace('bg-', 'text-').split(' ')[0]}`}>
                    {boardLabel.text}
                  </span>
                )}
                <span className={`${
                    isNotice ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-900 dark:text-gray-100"
                } truncate group-hover:text-brand-600 transition-colors`}>
                  {post.title}
                </span>
                {post.hasImg && (
                  <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>
                )}
                {post.commentCnt != null && post.commentCnt > 0 && (
                  <span className="text-brand-500 text-xs font-bold shrink-0">[{post.commentCnt}]</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400 w-full md:w-auto shrink-0 md:ml-auto">
                 <span className="flex items-center w-20 truncate justify-end" title="작성자">
                    <i className="fas fa-user mr-1 text-[10px] opacity-70"></i>
                    {post.authorName}
                </span>
                <span className="w-14 text-center" title="작성일">
                    {/* Use simplified date format for mobile list match */}
                    {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center justify-center w-12" title="조회수">
                    <i className="fas fa-eye mr-1 text-[10px] opacity-70"></i>
                    {formatViewCount(post.viewCount)}
                </span>
                <span className="flex items-center justify-end w-14 shrink-0 tabular-nums" title="추천/비추천">
                  <i className="fas fa-thumbs-up mr-1 text-[10px] text-brand-500"></i>
                  <span className="text-brand-500 font-bold">{post.likeCount}</span>
                  <span className="text-gray-300 mx-0.5">/</span>
                  <span className="text-gray-400">{post.dislikeCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
