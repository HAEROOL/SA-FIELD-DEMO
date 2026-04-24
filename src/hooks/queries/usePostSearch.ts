import { useQuery } from "@tanstack/react-query";
import { postService } from "@/apis/postService";
import { SearchTarget } from "@/apis/types/post.type";

const BOARD_CODE_MAP: Record<string, number> = {
  notice: 0,
  free: 1,
  strategy: 2,
  third: 3,
  asupply: 4,
  ranked: 5,
  daerul: 6,
  broadcast: 7,
};

export const usePostSearch = (
  currentBoard: string,
  searchTarget: SearchTarget,
  keyword: string,
  page: number = 0,
  size: number = 15
) => {
  const boardCode = BOARD_CODE_MAP[currentBoard] ?? 1;
  const enabled = keyword.trim().length > 0;

  return useQuery({
    queryKey: ["postSearch", currentBoard, searchTarget, keyword, page, size],
    queryFn: () =>
      postService.searchPosts({ boardCode, searchTarget, keyword, page, size }),
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
};
