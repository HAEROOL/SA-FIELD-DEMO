"use client";

import { useState, useTransition } from "react";
import { usePosts } from "@/hooks/queries/usePosts";
import BoardTable from "./BoardTable";

export default function NoticeBoardList() {
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { data: boardData } = usePosts("NOTICE", page);

  const totalPages = boardData?.notices.totalPages ?? 1;
  const groupStart = Math.floor(page / 10) * 10;
  const groupEnd = Math.min(groupStart + 9, totalPages - 1);

  const changePage = (newPage: number) => {
    startTransition(() => setPage(newPage));
  };

  return (
    <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
      <BoardTable
        posts={boardData?.notices.content || []}
        notices={[]}
        currentBoardParam="notice"
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

    </div>
  );
}
