"use client";

import { useState } from "react";
import { SearchTarget } from "@/apis/types/post.type";
import { useAlert } from "@/contexts/AlertContext";

interface BoardSearchBarProps {
  onSearch: (keyword: string, searchTarget: SearchTarget) => void;
  initialKeyword?: string;
  initialTarget?: SearchTarget;
  className?: string;
}

export default function BoardSearchBar({
  onSearch,
  initialKeyword = "",
  initialTarget = "title",
  className,
}: BoardSearchBarProps) {
  const [searchTarget, setSearchTarget] = useState<SearchTarget>(initialTarget);
  const [keyword, setKeyword] = useState(initialKeyword);
  const { showAlert } = useAlert();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed.length < 2) {
      showAlert("검색어는 2자 이상 입력해주세요.");
      return;
    }
    if (trimmed.length > 20) {
      showAlert("검색어는 20자 이하로 입력해주세요.");
      return;
    }
    onSearch(trimmed, searchTarget);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-800 overflow-hidden${className ? ` ${className}` : ""}`}
    >
      <select
        value={searchTarget}
        onChange={(e) => setSearchTarget(e.target.value as SearchTarget)}
        className="shrink-0 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-brand-800 border-r border-gray-200 dark:border-gray-700 focus:outline-none cursor-pointer"
      >
        <option value="title">제목</option>
        <option value="title_content">제목+내용</option>
      </select>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요 (2~20자)"
        maxLength={20}
        className="flex-1 px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-brand-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none min-w-0"
      />
      <button
        type="submit"
        className="shrink-0 px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white transition"
      >
        <i className="fas fa-search text-xs"></i>
      </button>
    </form>
  );
}
