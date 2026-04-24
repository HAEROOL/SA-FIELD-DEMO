import { renderHook, waitFor } from "@testing-library/react";
import { BoardListResponseDto } from "@/apis/types/post.type";
import { usePosts } from "@/hooks/queries/usePosts";
import { postService } from "@/apis/postService";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock postService
vi.mock("@/apis/postService", () => ({
  postService: {
    getBoardList: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("게시판 리스트를 성공적으로 가져오는지 확인", async () => {
    const mockPosts = [
      {
        postId: 1,
        title: "테스트 게시글 1",
        content: "내용 1",
        authorName: "작성자 1",
        viewCount: 0,
        boardDesc: "자유게시판",
        likeCount: 0,
        dislikeCount: 0,
        createdAt: "2024-01-01T00:00:00Z",
      },
    ];

    // Mock implementation
    vi.mocked(postService.getBoardList).mockResolvedValue({
      notices: { content: [] },
      posts: {
        content: mockPosts,
      }
    } as unknown as BoardListResponseDto);

    const { result } = renderHook(() => usePosts("FREE"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ notices: { content: [] }, posts: { content: mockPosts } });
    expect(postService.getBoardList).toHaveBeenCalledWith("FREE", 0);
  });
});
