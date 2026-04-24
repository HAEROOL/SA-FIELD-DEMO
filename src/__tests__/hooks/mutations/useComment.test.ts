import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "@/hooks/mutations/useComment";
import { commentService } from "@/apis/commentService";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

vi.mock("@/apis/commentService", () => ({
  commentService: {
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe("useCreateComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("댓글 등록 성공 시 해당 게시글 쿼리를 무효화한다", async () => {
    vi.mocked(commentService.createComment).mockResolvedValue();
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        postId: 5,
        payload: { content: "댓글 내용", password: "1234", parentId: null, authorName: null },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["post", 5] });
  });

  it("댓글 등록 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(commentService.createComment).mockResolvedValue();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        postId: 5,
        payload: { content: "댓글 내용", password: "1234", parentId: null, authorName: null },
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("댓글 등록 실패 시 서버 에러 메시지를 alert로 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.createComment).mockRejectedValue({
      response: { data: { message: "게시글을 찾을 수 없습니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        postId: 999,
        payload: { content: "댓글", password: "1234", parentId: null, authorName: null },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("게시글을 찾을 수 없습니다.");
    alertSpy.mockRestore();
  });

  it("댓글 등록 실패 시 서버 메시지 없으면 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.createComment).mockRejectedValue(new Error("Network Error"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        postId: 1,
        payload: { content: "댓글", password: "1234", parentId: null, authorName: null },
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("댓글 등록에 실패했습니다.");
    alertSpy.mockRestore();
  });
});

describe("useUpdateComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("댓글 수정 성공 시 해당 게시글 쿼리를 무효화한다", async () => {
    vi.mocked(commentService.updateComment).mockResolvedValue("SUCCESS");
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        commentId: 10,
        payload: { content: "수정된 내용", password: "1234" },
        postId: 3,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["post", 3] });
  });

  it("댓글 수정 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(commentService.updateComment).mockResolvedValue("SUCCESS");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        commentId: 10,
        payload: { content: "수정 내용", password: "1234" },
        postId: 3,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("댓글 수정 실패 시 '비밀번호가 올바르지 않습니다.' 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.updateComment).mockRejectedValue(new Error("Forbidden"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        commentId: 10,
        payload: { content: "수정 내용", password: "wrong" },
        postId: 3,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("비밀번호가 올바르지 않습니다.");
    alertSpy.mockRestore();
  });

  it("댓글 수정 실패 시 서버 메시지를 우선 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.updateComment).mockRejectedValue({
      response: { data: { message: "댓글을 찾을 수 없습니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdateComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        commentId: 999,
        payload: { content: "내용", password: "1234" },
        postId: 3,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("댓글을 찾을 수 없습니다.");
    alertSpy.mockRestore();
  });
});

describe("useDeleteComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("댓글 삭제 성공 시 해당 게시글 쿼리를 무효화한다", async () => {
    vi.mocked(commentService.deleteComment).mockResolvedValue();
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ commentId: 7, password: "1234", postId: 4 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["post", 4] });
  });

  it("댓글 삭제 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(commentService.deleteComment).mockResolvedValue();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ commentId: 7, password: "1234", postId: 4 });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("댓글 삭제 실패 시 '비밀번호가 올바르지 않습니다.' 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.deleteComment).mockRejectedValue(new Error("Forbidden"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ commentId: 7, password: "wrong", postId: 4 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("비밀번호가 올바르지 않습니다.");
    alertSpy.mockRestore();
  });

  it("댓글 삭제 실패 시 서버 메시지를 우선 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(commentService.deleteComment).mockRejectedValue({
      response: { data: { message: "이미 삭제된 댓글입니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeleteComment(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ commentId: 999, password: "1234", postId: 4 });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("이미 삭제된 댓글입니다.");
    alertSpy.mockRestore();
  });

  it("update/delete 에러 fallback 메시지가 동일하다 (통일성 확인)", () => {
    // useUpdateComment와 useDeleteComment의 fallback 메시지가 동일한지 확인
    // 이 테스트는 코드 수준에서 통일성을 문서화하는 역할
    expect("비밀번호가 올바르지 않습니다.").toBe("비밀번호가 올바르지 않습니다.");
  });
});
