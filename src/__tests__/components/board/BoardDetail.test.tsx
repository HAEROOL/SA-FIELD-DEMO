import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import BoardDetail from "@/components/board/BoardDetail";
import { postService } from "@/apis/postService";
import { commentService } from "../../../apis/commentService";
import { PostInfoResponseDto } from "@/apis/types/post.type";

// postService를 모킹
vi.mock("@/apis/postService", () => ({
  postService: {
    getPostInfo: vi.fn(),
    deletePost: vi.fn(),
    votePost: vi.fn(),
  },
}));

vi.mock("../../../apis/commentService", () => ({
  commentService: {
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

// Next.js Link 모킹
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Next.js useRouter 모킹
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("BoardDetail", () => {
  let queryClient: QueryClient;

  const mockPost: PostInfoResponseDto = {
    postId: 2,
    title: "이번 시즌 랭크전 맵 밸런스 토론합니다.",
    content: "<p>제3보급창고 레드팀 유리함이 너무 심한 것 같네요...</p>",
    authorName: "갓스나",
    viewCount: 1245,
    boardDesc: "자유",
    likeCount: 124,
    dislikeCount: 12,
    createdAt: "2024-12-09T14:30:00",
    comments: [
      {
        commentId: 1,
        content: "인정합니다. 블루 숏 작업하기가 너무 힘들어요.",
        authorName: "익명_Sniper",
        createdAt: "2024-12-09T14:35:00",
        children: [
            {
                commentId: 3,
                content: "맞아요, 특히 스나이퍼 있으면 답이 없죠.",
                authorName: "익명_Rifle",
                createdAt: "2024-12-09T14:36:00",
                children: []
            }
        ]
      },
      {
        commentId: 2,
        content: "그쵸? 저만 느끼는게 아니었네요.",
        authorName: "갓스나",
        createdAt: "2024-12-09T14:40:00",
        children: []
      },
    ],
  };

  beforeEach(() => {
    // 각 테스트마다 새로운 QueryClient 생성
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // postService.getPostInfo 모킹 설정
    vi.mocked(postService.getPostInfo).mockResolvedValue(mockPost);
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>{component}</Suspense>
      </QueryClientProvider>
    );
  };

  it("게시글 제목을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    const title = await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
    expect(title).toBeInTheDocument();
  });

  it("게시글 작성자를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 제목이 먼저 로드될 때까지 기다림
    await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

    // 모든 "갓스나" 텍스트를 찾고, 그 중 하나가 있으면 OK
    const authorElements = screen.getAllByText(/갓스나/i);
    expect(authorElements.length).toBeGreaterThan(0);
  });

  it("게시글 내용을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    expect(
      await screen.findByText(/제3보급창고 레드팀 유리함이 너무 심한 것 같네요.../i)
    ).toBeInTheDocument();
  });

  it("게시글 조회수를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    expect(await screen.findByText(/1,245/i)).toBeInTheDocument();
  });

  it("게시글 추천/비추천 버튼을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 먼저 데이터 로드 기다림
    await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

    // 추천/비추천 버튼 찾기 (여러 개가 있을 수 있음)
    const likeButtons = screen.getAllByText("124");
    const dislikeButtons = screen.getAllByText("12");
    expect(likeButtons.length).toBeGreaterThan(0);
    expect(dislikeButtons.length).toBeGreaterThan(0);
  });

  it("댓글 목록을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 댓글 내용 확인
    expect(
      await screen.findByText(/인정합니다. 블루 숏 작업하기가 너무 힘들어요./i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/그쵸\? 저만 느끼는게 아니었네요./i)
    ).toBeInTheDocument();
  });

  it("댓글 수를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 댓글 헤더 찾기
    const commentHeader = await screen.findByText(/댓글/i);
    expect(commentHeader).toBeInTheDocument();

    // 댓글 수 확인 (2개)
    const commentCountElement = commentHeader.parentElement?.querySelector(
      ".text-brand-500"
    );
    expect(commentCountElement?.textContent).toBe("2");
  });

  it("목록으로 돌아가기 링크를 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 컴포넌트 상단의 "목록으로" 링크 확인
    const backLink = await screen.findByText(/목록으로$/i);
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/board?board=popular");
  });

  it("수정/삭제 버튼을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 먼저 데이터 로드 기다림
    await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

    // 수정/삭제 버튼들 찾기 (게시글과 댓글 모두)
    const editButtons = screen.getAllByRole("button", { name: /수정/i });
    const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it("댓글 작성 폼을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardDetail id="2" />);

    // 닉네임 입력 필드는 제거됨
    // const nicknameInput = await screen.findByPlaceholderText(/닉네임/i);
    // expect(nicknameInput).toBeInTheDocument();

    // 비밀번호 입력 필드
    const passwordInput = await screen.findByPlaceholderText(/비밀번호/i);
    expect(passwordInput).toBeInTheDocument();

    // 댓글 내용 입력 필드
    const commentTextarea = await screen.findByPlaceholderText(/댓글을 입력하세요/i);
    expect(commentTextarea).toBeInTheDocument();

    // 등록 버튼
    const submitButton = await screen.findByRole("button", { name: /등록/i });
    expect(submitButton).toBeInTheDocument();
  });

  describe("게시글 삭제", () => {
    it("삭제 버튼 클릭 시 비밀번호를 입력받아야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

      renderWithQueryClient(<BoardDetail id="2" />);

      // 게시글의 삭제 버튼 찾기 (첫 번째 삭제 버튼)
      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      const postDeleteButton = deleteButtons[0]; // 첫 번째가 게시글 삭제 버튼

      await user.click(postDeleteButton);

      expect(promptSpy).toHaveBeenCalledWith("게시글을 삭제하려면 비밀번호를 입력하세요:");
      promptSpy.mockRestore();
    });

    it("비밀번호 입력 취소 시 삭제가 진행되지 않아야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      const postDeleteButton = deleteButtons[0];

      await user.click(postDeleteButton);

      expect(postService.deletePost).not.toHaveBeenCalled();
      promptSpy.mockRestore();
    });

    it("올바른 비밀번호 입력 시 삭제 API를 호출해야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("1234");
      vi.mocked(postService.deletePost).mockResolvedValue();

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      const postDeleteButton = deleteButtons[0];

      await user.click(postDeleteButton);

      await waitFor(() => {
        expect(postService.deletePost).toHaveBeenCalledWith(2, "1234");
      });

      promptSpy.mockRestore();
    });

    it("삭제 성공 시 게시판 목록으로 이동해야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("1234");
      vi.mocked(postService.deletePost).mockResolvedValue();

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      const postDeleteButton = deleteButtons[0];

      await user.click(postDeleteButton);

      // 성공 alert는 제거됨 - 라우팅만 확인
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/board?board=popular");
      });

      promptSpy.mockRestore();
    });

    it("삭제 실패 시 에러 메시지를 표시해야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("wrong");
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
      vi.mocked(postService.deletePost).mockRejectedValue(new Error("Wrong password"));

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      const postDeleteButton = deleteButtons[0];

      await user.click(postDeleteButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("게시글 삭제에 실패했습니다. 비밀번호를 확인해주세요.");
      });

      promptSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });

  describe("게시글 투표 (추천/비추천)", () => {
    it("추천 버튼 클릭 시 votePost API가 'LIKE'와 함께 호출되어야 한다", async () => {
      const user = userEvent.setup();
      vi.mocked(postService.votePost).mockResolvedValue("SUCCESS");

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

      // 추천 버튼 찾기 (좋아요 수 "124"가 있는 버튼)
      const likeButton = screen.getByRole("button", { name: /^124$/ });
      
      await user.click(likeButton);

      expect(postService.votePost).toHaveBeenCalledWith(2, "LIKE");
    });

    it("비추천 버튼 클릭 시 votePost API가 'DISLIKE'와 함께 호출되어야 한다", async () => {
      const user = userEvent.setup();
      vi.mocked(postService.votePost).mockResolvedValue("SUCCESS");

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

      // 비추천 버튼 찾기 (싫어요 수 "12"가 있는 버튼)
      const dislikeButton = screen.getByRole("button", { name: /^12$/ });
      
      await user.click(dislikeButton);

      expect(postService.votePost).toHaveBeenCalledWith(2, "DISLIKE");
    });
  });

  describe("댓글 기능", () => {
    it("댓글 작성 시 createComment API가 호출되어야 한다", async () => {
      const user = userEvent.setup();
      vi.mocked(commentService.createComment).mockResolvedValue();

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);

      // 댓글 작성 폼 찾기
      const passwordInput = screen.getByPlaceholderText("비밀번호");
      const contentInput = screen.getByPlaceholderText(/댓글을 입력하세요/i);
      const submitButton = screen.getByRole("button", { name: /등록/i });

      // 입력 및 제출
      await user.type(passwordInput, "1234");
      await user.type(contentInput, "새로운 댓글입니다.");
      await user.click(submitButton);

      expect(commentService.createComment).toHaveBeenCalledWith(2, {
        content: "새로운 댓글입니다.",
        password: "1234",
        parentId: null,
        authorName: null,
      });
    });

    it("댓글 삭제 시 비밀번호 입력 후 deleteComment API가 호출되어야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("1234");
      vi.mocked(commentService.deleteComment).mockResolvedValue();

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText("익명_Sniper");

      // 첫 번째 댓글의 삭제 버튼 찾기 (모든 삭제 버튼 중 첫번째는 게시글 삭제, 그 다음이 댓글 삭제일 것임.
      // 하지만 테스트의 정확성을 위해 댓글 섹션 내의 삭제 버튼을 찾아야 함.
      // 여기서는 텍스트로 찾거나, test-id를 사용하는게 좋지만, 일단 role로 모든 삭제 버튼을 가져와서 두번째 것을 사용한다고 가정.
      // 게시글 삭제 버튼 1개, 댓글 2개이므로 총 3개)
      const deleteButtons = screen.getAllByRole("button", { name: /삭제/i });
      // index 0: Board Delete, index 1: Comment 1 Delete
      const commentDeleteButton = deleteButtons[1];

      await user.click(commentDeleteButton);

      expect(promptSpy).toHaveBeenCalledWith("댓글을 삭제하려면 비밀번호를 입력하세요:");
      expect(commentService.deleteComment).toHaveBeenCalledWith(1, "1234");

      promptSpy.mockRestore();
    });

    // 수정 기능은 UI 상태 변화가 필요하므로, 먼저 '수정' 버튼 클릭 시 인풋으로 변하는지 확인 필요
    // 하지만 현재 구현 전이므로 테스트 시나리오만 작성
    it("댓글 수정 버튼 클릭 시 수정 모드로 진입하고 updateComment API가 호출되어야 한다", async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("1234"); // 비밀번호 확인용
      vi.mocked(commentService.updateComment).mockResolvedValue("SUCCESS");

      renderWithQueryClient(<BoardDetail id="2" />);

      await screen.findByText("익명_Sniper");

      const updateButtons = screen.getAllByRole("button", { name: /수정/i });
      // index 0: 게시글 수정 버튼 (button element)
      // index 1: 첫 번째 댓글 수정 버튼
      const commentUpdateButton = updateButtons[1];

      await user.click(commentUpdateButton);

      // 수정 모드 진입 확인 (기존 텍스트가 input/textarea value로 들어가 있어야 함)
      // "인정합니다. 블루 숏 작업하기가 너무 힘들어요."
      const editInput = await screen.findByDisplayValue("인정합니다. 블루 숏 작업하기가 너무 힘들어요.");
      expect(editInput).toBeInTheDocument();

      // 내용 수정
      await user.clear(editInput);
      await user.type(editInput, "수정된 댓글 내용");
      
      // 비밀번호 입력 
      // 수정 모드에서는 value가 ""인 비밀번호 인풋이 렌더링됨.
      // placeholder="비밀번호"인 인풋이 여러개 (댓글 작성란, 댓글 수정란)
      // 현재 수정중인 댓글 내의 비밀번호 인풋을 찾아야 함.
      // value가 ""인 비밀번호 인풋을 찾아서 입력
      const passwordInputs = screen.getAllByPlaceholderText("비밀번호");
      // 인덱스를 알기 어려우므로, 컨테이너를 한정짓거나 해야하지만 간단히 마지막 인풋(비동기로 렌더링된)을 사용 시도하거나
      // 수정 모드 div 내의 인풋을 찾아야 함. 하지만 screen.getAllBy... 는 전체에서 찾음.
      
      // 더 정확한 방법: test-id를 주거나, 주변 텍스트로 찾기.
      // 여기서는 (수정 중) 텍스트가 있는 div 내의 input을 찾으면 좋음.
      // 하지만 RTL 원칙상 사용자 인터랙션 흐름대로..
      // 화면에 비밀번호 인풋이 2개(작성용, 수정용) 있을 것임.
      // 수정용은 value가 ""임.
      
      const editPasswordInput = passwordInputs.find(input => (input as HTMLInputElement).value === "");
      if (editPasswordInput) {
          await user.type(editPasswordInput, "1234");
      }

      // 저장 버튼 클릭
      const saveButton = screen.getByRole("button", { name: /저장/i });
      await user.click(saveButton);

      expect(commentService.updateComment).toHaveBeenCalledWith(1, {
          content: "수정된 댓글 내용",
          password: "1234"
      });

      promptSpy.mockRestore();
    });
    it("대댓글이 렌더링되어야 한다", async () => {
        renderWithQueryClient(<BoardDetail id="2" />);
  
        // 대댓글 내용 확인
        expect(
          await screen.findByText(/맞아요, 특히 스나이퍼 있으면 답이 없죠./i)
        ).toBeInTheDocument();
  
        // 들여쓰기 여부 확인 (클래스나 스타일로 확인 가능하지만, 간단히 텍스트 존재 여부로 우선 확인)
        // 실제 들여쓰기는 시각적인 부분이므로 unit test에서는 구조가 올바른지 확인
    });

    it("답글 버튼 클릭 시 답글 작성 폼이 나타나야 한다", async () => {
        const user = userEvent.setup();
        renderWithQueryClient(<BoardDetail id="2" />);

        await screen.findByText(/인정합니다. 블루 숏 작업하기가 너무 힘들어요./i);

        // "답글" 버튼 찾기 (여러 개일 수 있음)
        const replyButtons = screen.getAllByRole("button", { name: /답글/i });
        const firstReplyButton = replyButtons[0];

        await user.click(firstReplyButton);

        // 답글 작성 폼 확인
        expect(screen.getByPlaceholderText(/답글 내용을 입력하세요./i)).toBeInTheDocument();
        // 비밀번호 필드가 여러 개일 수 있으므로 (댓글 작성용 + 답글 작성용), 답글 폼 내의 것을 확인하거나 개수로 확인
        const passwordInputs = screen.getAllByPlaceholderText("비밀번호");
        expect(passwordInputs.length).toBeGreaterThan(1); // 최소 2개 이상 (메인 댓글 폼 + 답글 폼)
        expect(screen.getByRole("button", { name: /취소/i })).toBeInTheDocument();
    });

    it("답글 작성 시 createComment API가 parentId와 함께 호출되어야 한다", async () => {
        const user = userEvent.setup();
        vi.mocked(commentService.createComment).mockResolvedValue();

        renderWithQueryClient(<BoardDetail id="2" />);

        await screen.findByText(/인정합니다. 블루 숏 작업하기가 너무 힘들어요./i);

        // 첫 번째 댓글에 답글 달기
        const replyButtons = screen.getAllByRole("button", { name: /답글/i });
        await user.click(replyButtons[0]);

        // 폼 입력
        const replyInput = screen.getByPlaceholderText(/답글 내용을 입력하세요./i);
        const passwordInput = screen.getAllByPlaceholderText("비밀번호").find(input => (input as HTMLInputElement).value === "")!; // 빈 비밀번호 필드 찾기
        const submitButton = screen.getAllByRole("button", { name: /등록/i }).find(btn => btn.closest('.animate-fade-in-down'))!; // 답글 폼의 등록 버튼 찾기

        await user.type(replyInput, "동감합니다.");
        await user.type(passwordInput, "1234");
        await user.click(submitButton);

        expect(commentService.createComment).toHaveBeenCalledWith(2, {
            content: "동감합니다.",
            password: "1234",
            parentId: 1, // 첫 번째 댓글의 ID
            authorName: null,
        });
    });

    it("대댓글에는 답글 버튼이 표시되지 않아야 한다 (최대 2단계)", async () => {
        renderWithQueryClient(<BoardDetail id="2" />);

        // 대댓글 텍스트가 로드될 때까지 기다림
        await screen.findByText("맞아요, 특히 스나이퍼 있으면 답이 없죠.");

        // 대댓글 요소 찾기
        // 텍스트로 찾고 그 부모/형제 요소 탐색 혹은 구조적으로 접근
        // 여기서는 간단히 '답글' 버튼의 개수를 확인하거나, 특정 텍스트 주변에 답글 버튼이 없는지 확인
        
        // 전체 '답글' 버튼 수 확인
        // Mock Data: 
        // 1. Root Comment (Id: 1) -> Has Reply button
        //    -> Child Comment (Id: 3) -> No Reply button
        // 2. Root Comment (Id: 2) -> Has Reply button
        const replyButtons = screen.getAllByRole("button", { name: /답글/i });
        expect(replyButtons).toHaveLength(2); 
    });
    it("수정된 댓글에는 '(수정됨)' 문구가 표시되어야 한다", async () => {
        // 수정된 댓글 Mock Data 주입이 필요하지만, 여기서는 새로운 render를 하기 어려우므로
        // renderWithQueryClient에서 사용하는 mockPost를 수정하거나, override할 수 있어야 함.
        // 하지만 beforeEach에서 이미 mock이 설정됨.
        // 따라서, 이 테스트 케이스를 위해 별도의 mock 데이터를 설정하고 render해야 함.
        
        const modifiedPost = {
            ...mockPost,
            comments: [
                {
                    commentId: 10,
                    content: "수정된 댓글 내용입니다.",
                    authorName: "작성자",
                    createdAt: "2024-12-09T14:35:00",
                    isUpdated: true, // 수정됨
                }
            ]
        };
        vi.mocked(postService.getPostInfo).mockResolvedValue(modifiedPost);

        renderWithQueryClient(<BoardDetail id="2" />);

        await screen.findByText("수정된 댓글 내용입니다.");
        expect(screen.getByText("(수정됨)")).toBeInTheDocument();
    });
  });
});

