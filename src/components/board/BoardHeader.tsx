"use client";

import { BoardType } from "@/apis/types/post.type";

interface BoardHeaderProps {
  activeBoard: string;
  onBoardChange: (boardId: string) => void;
}

export default function BoardHeader({
  activeBoard,
  onBoardChange,
}: BoardHeaderProps) {
  const boards = [
    { id: "popular", label: "인기게시판", icon: "fa-fire", type: undefined },
    { id: "free", label: "자유게시판", icon: "fa-comment-dots", type: "FREE" as BoardType },
    { id: "ranked", label: "랭크전게시판", icon: "fa-trophy", type: "RANKED" as BoardType },
    { id: "third", label: "3부게시판", icon: "fa-users", type: "THIRD_DIVISION" as BoardType },
    { id: "asupply", label: "A보급게시판", icon: "fa-box", type: "A_SUPPLY" as BoardType },
    { id: "daerul", label: "대룰게시판", icon: "fa-crosshairs", type: "DAERUL" as BoardType },
    { id: "broadcast", label: "방송게시판", icon: "fa-broadcast-tower", type: "BROADCAST" as BoardType },
    { id: "strategy", label: "공략게시판", icon: "fa-chess", type: "STRATEGY" as BoardType },
    { id: "notice", label: "공지사항", icon: "fa-bullhorn", type: "NOTICE" as BoardType },
  ];

  return (
    <aside className="w-full md:w-44 shrink-0 md:sticky md:top-24">
      <div className="flex flex-col bg-white dark:bg-brand-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Dark Header */}
        <div className="bg-[#2d3038] p-4 border-b border-gray-700 flex items-center gap-2">
          <i className="fas fa-comments text-brand-500 text-lg"></i>
          <h1 className="text-base font-bold text-white">
            커뮤니티
          </h1>
        </div>

        {/* Mobile Select */}
        <div className="md:hidden p-4">
          <select
            value={activeBoard}
            onChange={(e) => onBoardChange(e.target.value)}
            className="w-full bg-white dark:bg-brand-900 text-gray-900 dark:text-white text-sm font-bold border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
          >
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar Menu */}
        <nav className="hidden md:flex flex-col">
          {boards.map((board) => (
            <button
              key={board.id}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all duration-200 border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                activeBoard === board.id
                  ? "bg-brand-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-700 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => onBoardChange(board.id)}
            >
              <div className={`w-6 h-6 flex items-center justify-center ${
                activeBoard === board.id 
                ? "bg-white/20" 
                : "bg-gray-100 dark:bg-brand-900 group-hover:bg-white dark:group-hover:bg-brand-600"
              }`}>
                <i className={`fas ${board.icon} text-xs ${activeBoard === board.id ? "text-white" : "text-brand-500"}`}></i>
              </div>
              {board.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
