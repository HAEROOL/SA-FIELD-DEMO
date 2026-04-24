import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreatePost, useUpdatePost, useDeletePost } from "@/hooks/mutations/usePost";
import { postService } from "@/apis/postService";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

vi.mock("@/apis/postService", () => ({
  postService: {
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
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

describe("useCreatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("게시글 생성 성공 시 postService.createPost를 올바른 인자로 호출한다", async () => {
    vi.mocked(postService.createPost).mockResolvedValue(42);
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    const payload = {
      title: "테스트 제목",
      content: "테스트 내용",
      boardType: "FREE" as const,
      password: "1234",
    };

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(postService.createPost).toHaveBeenCalledWith(payload);
    expect(result.current.data).toBe(42);
  });

  it("게시글 생성 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(postService.createPost).mockResolvedValue(1);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        title: "제목",
        content: "내용",
        boardType: "FREE",
        password: "1234",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("게시글 생성 실패 시 서버 에러 메시지를 alert로 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.createPost).mockRejectedValue({
      response: { data: { message: "중복된 제목입니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        title: "중복제목",
        content: "내용",
        boardType: "FREE",
        password: "1234",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("중복된 제목입니다.");
    alertSpy.mockRestore();
  });

  it("게시글 생성 실패 시 서버 메시지 없으면 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.createPost).mockRejectedValue(new Error("Network Error"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        title: "제목",
        content: "내용",
        boardType: "FREE",
        password: "1234",
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith(
      "게시글 등록에 실패했습니다. 다시 시도해주세요."
    );
    alertSpy.mockRestore();
  });
});

describe("useUpdatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("게시글 수정 성공 시 관련 쿼리 캐시를 무효화한다", async () => {
    vi.mocked(postService.updatePost).mockResolvedValue(1);
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUpdatePost(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ title: "수정 제목", content: "수정 내용", password: "1234" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["post", 1] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
  });

  it("게시글 수정 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(postService.updatePost).mockResolvedValue(1);
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdatePost(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ title: "제목", content: "내용", password: "1234" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("게시글 수정 실패 시 서버 에러 메시지를 alert로 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.updatePost).mockRejectedValue({
      response: { data: { message: "비밀번호가 틀렸습니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdatePost(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ title: "제목", content: "내용", password: "wrong" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("비밀번호가 틀렸습니다.");
    alertSpy.mockRestore();
  });

  it("게시글 수정 실패 시 서버 메시지 없으면 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.updatePost).mockRejectedValue(new Error("Network Error"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useUpdatePost(1), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({ title: "제목", content: "내용", password: "1234" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith(
      "게시글 수정에 실패했습니다. 비밀번호를 확인해주세요."
    );
    alertSpy.mockRestore();
  });
});

describe("useDeletePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("게시글 삭제 성공 시 게시판 목록 쿼리를 무효화한다", async () => {
    vi.mocked(postService.deletePost).mockResolvedValue();
    const queryClient = createQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useDeletePost(2), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate("1234");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["posts"] });
  });

  it("게시글 삭제 성공 시 alert를 표시하지 않는다", async () => {
    vi.mocked(postService.deletePost).mockResolvedValue();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeletePost(2), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate("1234");
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("게시글 삭제 실패 시 서버 에러 메시지를 alert로 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.deletePost).mockRejectedValue({
      response: { data: { message: "비밀번호가 일치하지 않습니다." } },
    });
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeletePost(2), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate("wrong");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith("비밀번호가 일치하지 않습니다.");
    alertSpy.mockRestore();
  });

  it("게시글 삭제 실패 시 서버 메시지 없으면 기본 메시지를 표시한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(postService.deletePost).mockRejectedValue(new Error("Network Error"));
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeletePost(2), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate("1234");
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(alertSpy).toHaveBeenCalledWith(
      "게시글 삭제에 실패했습니다. 비밀번호를 확인해주세요."
    );
    alertSpy.mockRestore();
  });

  it("삭제 성공 시 onSuccess 콜백이 호출된다", async () => {
    vi.mocked(postService.deletePost).mockResolvedValue();
    const onSuccessCallback = vi.fn();
    const queryClient = createQueryClient();
    const { result } = renderHook(() => useDeletePost(2), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate("1234", { onSuccess: onSuccessCallback });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(onSuccessCallback).toHaveBeenCalled();
  });
});
