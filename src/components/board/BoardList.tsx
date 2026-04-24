"use client";

import { BoardType } from "@/apis/types/post.type";
import TrendingBoardList from "./TrendingBoardList";
import NormalBoardList from "./NormalBoardList";
import NoticeBoardList from "./NoticeBoardList";

interface BoardListProps {
  type?: BoardType;
  offset?: number;
  currentBoard?: string;
}

export default function BoardList({
  type,
  offset = 0,
  currentBoard = "popular",
}: BoardListProps = {}) {
  if (currentBoard === "popular") {
    return <TrendingBoardList currentBoard={currentBoard} />;
  }
  if (currentBoard === "notice") {
    return <NoticeBoardList />;
  }
  return (
    <NormalBoardList
      type={type}
      offset={offset}
      currentBoard={currentBoard}
    />
  );
}
