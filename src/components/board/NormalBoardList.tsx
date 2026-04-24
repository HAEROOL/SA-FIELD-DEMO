"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePosts } from "@/hooks/queries/usePosts";
import { BoardType, SearchTarget } from "@/apis/types/post.type";
import BoardTable from "./BoardTable";
import BoardSearchBar from "./BoardSearchBar";
import BoardSearchResult from "./BoardSearchResult";

interface NormalBoardListProps {
  type?: BoardType;
  offset?: number;
  currentBoard?: string;
}

export default function NormalBoardList({
  type,
  currentBoard = "free",
}: NormalBoardListProps) {
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { data: boardData } = usePosts(type, page);

  // 검색 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("title");
  const [searchPage, setSearchPage] = useState(0);
  const isSearchMode = searchKeyword.length > 0;

  const totalPages = boardData?.posts.totalPages ?? 1;
  const groupStart = Math.floor(page / 10) * 10;
  const groupEnd = Math.min(groupStart + 9, totalPages - 1);

  const changePage = (newPage: number) => {
    startTransition(() => setPage(newPage));
  };

  const handleSearch = (keyword: string, target: SearchTarget) => {
    setSearchKeyword(keyword);
    setSearchTarget(target);
    setSearchPage(0);
  };

  const handleCloseSearch = () => {
    setSearchKeyword("");
    setSearchPage(0);
  };

  const searchBarNode = <BoardSearchBar onSearch={handleSearch} className="h-9" />;
  const footerSearchBarNode = <BoardSearchBar onSearch={handleSearch} className="h-9" />;

  return (
    <div>
      {isSearchMode ? (
        <BoardSearchResult
          currentBoard={currentBoard}
          keyword={searchKeyword}
          searchTarget={searchTarget}
          page={searchPage}
          onSearch={handleSearch}
          onPageChange={setSearchPage}
          onClose={handleCloseSearch}
        />
      ) : (
        <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
          {/* 상단 검색바: 글쓰기 버튼 아래 (BoardTable 헤더 직후) */}
          <BoardTable
            posts={boardData?.posts.content || []}
            notices={boardData?.notices.content || []}
            currentBoardParam={currentBoard}
            startIndex={page}
            searchBar={searchBarNode}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 py-3 bg-white dark:bg-brand-800 border-t border-gray-200 dark:border-gray-700">
              {groupStart > 0 && (
                <button
                  onClick={() => changePage(groupStart - 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-700 transition"
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 text-sm font-bold transition ${
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
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-700 transition"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              )}
            </div>
          )}

          {/* Footer: 하단 검색바 + 글쓰기 버튼 */}
          <div className="px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:gap-3 bg-white dark:bg-brand-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0">{footerSearchBarNode}</div>
            <Link
              href={`/board/write${currentBoard && currentBoard !== "popular" ? `?type=${currentBoard}` : ""}`}
              className="md:shrink-0 h-9 bg-brand-600 hover:bg-brand-500 text-white font-bold px-5 flex items-center justify-center gap-2 transition transform hover:scale-105 text-sm"
            >
              <i className="fas fa-pen"></i> <span>글쓰기</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
