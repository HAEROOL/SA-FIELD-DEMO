"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePostSearch } from "@/hooks/queries/usePostSearch";
import { SearchTarget, PostResponseDto } from "@/apis/types/post.type";
import BoardSearchBar from "./BoardSearchBar";
import Loader from "@/components/common/Loader";

interface BoardSearchResultProps {
  currentBoard: string;
  keyword: string;
  searchTarget: SearchTarget;
  page: number;
  onSearch: (keyword: string, searchTarget: SearchTarget) => void;
  onPageChange: (page: number) => void;
  onClose: () => void;
}

export default function BoardSearchResult({
  currentBoard,
  keyword,
  searchTarget,
  page,
  onSearch,
  onPageChange,
  onClose,
}: BoardSearchResultProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data, isLoading, isError } = usePostSearch(
    currentBoard,
    searchTarget,
    keyword,
    page
  );

  const notices: PostResponseDto[] = data?.notices.content ?? [];
  const posts: PostResponseDto[] = data?.posts.content ?? [];
  const totalElements = data?.posts.totalElements ?? 0;
  const totalPages = data?.posts.totalPages ?? 0;
  const groupStart = Math.floor(page / 10) * 10;
  const groupEnd = Math.min(groupStart + 9, totalPages - 1);
  const isEmpty = notices.length === 0 && posts.length === 0;

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
    return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatViewCount = (count: number): string => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const changePage = (newPage: number) => {
    startTransition(() => onPageChange(newPage));
  };

  const renderDesktopRow = (post: PostResponseDto, isNotice: boolean) => (
    <tr
      key={`${isNotice ? "n" : "p"}-${post.postId}`}
      className={`${
        isNotice
          ? "bg-brand-50 dark:bg-brand-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
      } transition cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0`}
      onClick={() => router.push(`/board/${post.postId}?from=${currentBoard}`)}
    >
      <td className={`py-3 pl-4 max-w-0 ${isNotice ? "font-bold text-gray-900 dark:text-white" : "text-gray-900 dark:text-white"}`}>
        <div className="hover:text-brand-600 transition-colors flex items-center gap-1 overflow-hidden">
          {isNotice && (
            <span className="bg-brand-500 text-white px-1.5 py-0.5 text-[10px] font-bold shrink-0">공지</span>
          )}
          <span className="inline-flex items-center gap-1 min-w-0">
            <span className="truncate">{post.title}</span>
            {post.hasImg && <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>}
            {post.commentCnt != null && post.commentCnt > 0 && (
              <span className="text-brand-500 text-xs font-bold shrink-0">[{post.commentCnt}]</span>
            )}
          </span>
        </div>
      </td>
      <td className={`py-3 text-center ${isNotice ? "text-brand-500 font-bold" : "text-gray-900 dark:text-white font-medium"}`}>
        {post.authorName}
      </td>
      <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
        {formatDate(post.createdAt)}
      </td>
      <td className="py-3 text-center text-gray-500 dark:text-gray-400 text-xs">
        {formatViewCount(post.viewCount)}
      </td>
      <td className="py-3 text-center text-xs">
        <span className="text-brand-500 font-bold">{post.likeCount}</span>{" "}
        <span className="text-gray-300 mx-1">/</span>{" "}
        <span className="text-gray-400">{post.dislikeCount}</span>
      </td>
    </tr>
  );

  const renderMobileRow = (post: PostResponseDto, isNotice: boolean) => (
    <div
      key={`${isNotice ? "n" : "p"}-${post.postId}`}
      className={`px-4 py-3 ${isNotice ? "bg-brand-50 dark:bg-brand-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/30"} cursor-pointer transition-colors flex flex-col gap-2`}
      onClick={() => router.push(`/board/${post.postId}?from=${currentBoard}`)}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {isNotice && (
          <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-brand-500 text-white">공지</span>
        )}
        <span className={`${isNotice ? "font-bold" : "font-medium"} text-gray-900 dark:text-white truncate`}>
          {post.title}
        </span>
        {post.hasImg && <i className="fas fa-image text-gray-400 text-xs shrink-0"></i>}
        {post.commentCnt != null && post.commentCnt > 0 && (
          <span className="text-brand-500 text-xs font-bold shrink-0">[{post.commentCnt}]</span>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center w-20 truncate justify-end">
          <i className="fas fa-user mr-1 text-[10px] opacity-70"></i>
          {post.authorName}
        </span>
        <span className="w-14 text-center">{formatDate(post.createdAt)}</span>
        <span className="flex items-center justify-center w-12">
          <i className="fas fa-eye mr-1 text-[10px] opacity-70"></i>
          {formatViewCount(post.viewCount)}
        </span>
        <span className="flex items-center justify-end w-14 shrink-0 tabular-nums">
          <i className="fas fa-thumbs-up mr-1 text-[10px] text-brand-500"></i>
          <span className="text-brand-500 font-bold">{post.likeCount}</span>
          <span className="text-gray-300 mx-0.5">/</span>
          <span className="text-gray-400">{post.dislikeCount}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700">
      {/* 검색바 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <div className="flex-1">
          <BoardSearchBar
            onSearch={onSearch}
            initialKeyword={keyword}
            initialTarget={searchTarget}
            className="h-9"
          />
        </div>
        <button
          onClick={onClose}
          className="shrink-0 h-9 px-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-brand-700 transition"
        >
          <i className="fas fa-times mr-1"></i>닫기
        </button>
      </div>

      {isLoading && (
        <div className="px-4 py-12">
          <Loader size="md" />
        </div>
      )}

      {isError && (
        <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          검색 중 오류가 발생했습니다.
        </div>
      )}

      {!isLoading && !isError && isEmpty && (
        <div className="px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <i className="fas fa-search text-4xl text-gray-300 dark:text-gray-600"></i>
            <p className="text-gray-500 dark:text-gray-400">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                &ldquo;{keyword}&rdquo;
              </span>
              에 대한 검색 결과가 없습니다.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && !isEmpty && (
        <>
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
            총{" "}
            <span className="font-bold text-brand-600">{totalElements}</span>
            건의 검색 결과
          </div>

          {/* Desktop Table */}
          <div className={`hidden md:block overflow-x-auto ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 bg-[#f8f9fa] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2 text-left pl-4 min-w-50">제목</th>
                  <th className="py-2 text-center w-24">작성자</th>
                  <th className="py-2 text-center w-16">작성일</th>
                  <th className="py-2 text-center w-14">조회수</th>
                  <th className="py-2 text-center w-20">추천/비추천</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {notices.map((post) => renderDesktopRow(post, true))}
                {posts.map((post) => renderDesktopRow(post, false))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className={`md:hidden divide-y divide-gray-200 dark:divide-gray-700 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
            {notices.map((post) => renderMobileRow(post, true))}
            {posts.map((post) => renderMobileRow(post, false))}
          </div>

          {/* Pagination (posts 기준) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 py-3 border-t border-gray-200 dark:border-gray-700">
              {groupStart > 0 && (
                <button
                  onClick={() => changePage(groupStart - 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-700 transition"
                >
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>
              )}
              {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => {
                const p = groupStart + i;
                return (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`w-8 h-8 text-sm font-bold transition ${
                      p === page
                        ? "bg-brand-600 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-700"
                    }`}
                  >
                    {p + 1}
                  </button>
                );
              })}
              {groupEnd < totalPages - 1 && (
                <button
                  onClick={() => changePage(groupEnd + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-700 transition"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
