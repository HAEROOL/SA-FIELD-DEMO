import { useSuspenseQuery } from "@tanstack/react-query";
import { postService } from "@/apis/postService";
import { BoardType } from "@/apis/types/post.type";

/**
 * 게시판 목록 조회 훅
 * @param type - 게시판 타입 (optional)
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지 크기 (기본값: 10)
 */
export const usePosts = (type?: BoardType, page: number = 0, size: number = 15) => {
  return useSuspenseQuery({
    queryKey: ["posts", type, page, size],
    queryFn: () => postService.getBoardList(type, page, size),
    staleTime: 0,
    gcTime: 0,
  });
};

/**
 * 게시글 상세 조회 훅
 * @param id - 게시글 ID
 */
export const usePost = (id: number) => {
  return useSuspenseQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPostInfo(id),
    staleTime: 0, // 항상 최신 데이터를 가져옴
    gcTime: 0, // 캐시를 전혀 유지하지 않음 (조회수 증가를 위해)
  });
};

/**
 * 인기 게시글 목록 조회 훅
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지 크기 (기본값: 10)
 */
export const useTrendingPosts = (page: number = 0, size: number = 10) => {
  return useSuspenseQuery({
    queryKey: ["posts", "trending", page, size],
    queryFn: () => postService.getTrendingPosts(page, size),
    staleTime: 0,
    gcTime: 0,
  });
};
