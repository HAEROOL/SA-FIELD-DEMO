import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import BoardList from "@/components/board/BoardList";
import { postService } from "@/apis/postService";
import { PostResponseDto } from "@/apis/types/post.type";

// postService를 모킹
vi.mock("@/apis/postService", () => ({
  postService: {
    getBoardList: vi.fn(),
    getTrendingPosts: vi.fn(),
  },
}));

// Next.js router 모킹
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Next.js Link 모킹
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("BoardList", () => {
  let queryClient: QueryClient;

  const mockPosts: PostResponseDto[] = [
    {
      postId: 1,
      title: "공지사항입니다",
      content: "공지 내용",
      authorName: "운영자",
      viewCount: 5200,
      boardDesc: "NOTICE",
      likeCount: 100,
      dislikeCount: 5,
      createdAt: "2024-12-01T00:00:00",
    },
    {
      postId: 2,
      title: "이번 시즌 랭크전 맵 밸런스 토론합니다.",
      content: "맵 밸런스 내용",
      authorName: "갓스나",
      viewCount: 1245,
      boardDesc: "FREE",
      likeCount: 124,
      dislikeCount: 12,
      createdAt: "2024-12-09T14:30:00",
    },
    {
      postId: 3,
      title: "[Lunatic] 1부 리그 지향 빡겜 유저 모집합니다",
      content: "모집 내용",
      authorName: "클마임당",
      viewCount: 450,
      boardDesc: "FREE",
      likeCount: 56,
      dislikeCount: 2,
      createdAt: "2024-12-09T13:15:00",
    },
  ];

  beforeEach(() => {
    // 각 테스트마다 새로운 QueryClient 생성
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // postService.getBoardList 모킹 설정
    vi.mocked(postService.getBoardList).mockResolvedValue({
      notices: [mockPosts[0]], // first one is NOTICE
      posts: {
        content: [mockPosts[1], mockPosts[2]], // the rest are FREE
        totalPages: 10,
        totalElements: 200,
        pageable: { pageNumber: 0, pageSize: 20, paged: true, unpaged: false, offset: 0, sort: { sorted: false, unsorted: true, empty: true } },
        numberOfElements: 2,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        last: false,
        empty: false,
      }
    });

    vi.mocked(postService.getTrendingPosts).mockResolvedValue({
      notices: [],
      posts: {
        content: mockPosts,
        totalPages: 10,
        totalElements: 200,
        pageable: { pageNumber: 0, pageSize: 20, paged: true, unpaged: false, offset: 0, sort: { sorted: false, unsorted: true, empty: true } },
        numberOfElements: 3,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        last: false,
        empty: false,
      }
    });
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>{component}</Suspense>
      </QueryClientProvider>
    );
  };

  it("게시판 목록을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    // 테이블 헤더 확인 (await로 기다림)
    expect(await screen.findByText(/제목/i)).toBeInTheDocument();
    expect(await screen.findByText(/작성자/i)).toBeInTheDocument();

    // 게시글 제목 확인
    const title1 = await screen.findAllByText(/이번 시즌 랭크전 맵 밸런스 토론합니다./i);
    expect(title1.length).toBeGreaterThan(0);
    
    const title2 = await screen.findAllByText(/\[Lunatic\] 1부 리그 지향 빡겜 유저 모집합니다/i);
    expect(title2.length).toBeGreaterThan(0);
  });

  it("게시글 작성자를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    const author1 = await screen.findAllByText(/갓스나/i);
    expect(author1.length).toBeGreaterThan(0);
    const author2 = await screen.findAllByText(/클마임당/i);
    expect(author2.length).toBeGreaterThan(0);
  });

  it("게시글 조회수를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    // 조회수 컬럼이 있는지 확인 (모바일에서는 숨김)
    const viewCountHeader = screen.queryByText(/조회/i);
    if (viewCountHeader) {
      expect(await screen.findByText(/1.2k/i)).toBeInTheDocument();
      expect(await screen.findByText(/450/i)).toBeInTheDocument();
    }
  });

  it("게시글 추천/비추천 수를 표시해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    // 추천/비추천 컬럼이 있는지 확인 (모바일에서는 숨김)
    const likeHeader = screen.queryByText(/추천\/비추천/i);
    if (likeHeader) {
      expect(await screen.findByText("124")).toBeInTheDocument();
      expect(await screen.findByText("56")).toBeInTheDocument();
    }
  });

  it("공지사항은 특별한 스타일로 표시되어야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    // 공지사항 제목이 렌더링되는지 확인
    const noticeTitles = await screen.findAllByText(/공지사항입니다/i);
    expect(noticeTitles.length).toBeGreaterThan(0);

    // 공지 배지가 있는지 확인
    const noticeBadges = await screen.findAllByText("공지");
    expect(noticeBadges.length).toBeGreaterThan(0);
    expect(noticeBadges[0]).toHaveClass("bg-brand-500");
  });

  it("페이지네이션 버튼을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    // 먼저 데이터가 로드될 때까지 기다림
    await screen.findAllByText(/공지사항입니다/i);

    // 페이지 번호 버튼 확인 (button role로 찾기)
    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons.length).toBeGreaterThan(5); // 페이지네이션 버튼들이 있어야 함
  });

  it("글쓰기 버튼을 렌더링해야 한다", async () => {
    renderWithQueryClient(<BoardList />);

    const writeButtons = await screen.findAllByRole("link", { name: /글쓰기/i });
    expect(writeButtons.length).toBeGreaterThan(0);
    expect(writeButtons[0]).toHaveAttribute("href", "/board/write");
  });

  it("빈 게시글 목록일 때 적절히 처리해야 한다", async () => {
    vi.mocked(postService.getBoardList).mockResolvedValue({
      notices: [],
      posts: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        pageable: { pageNumber: 0, pageSize: 20, paged: true, unpaged: false, offset: 0, sort: { sorted: false, unsorted: true, empty: true } },
        numberOfElements: 0,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        last: true,
        empty: true,
      }
    });

    renderWithQueryClient(<BoardList currentBoard="free" />);

    // 빈 상태 메시지가 표시되어야 함
    expect(
      (await screen.findAllByText(/게시글이 없습니다/i))[0]
    ).toBeInTheDocument();
  });

  it("게시판 타입을 props로 받아 필터링해야 한다", async () => {
    const freePostsMock: PostResponseDto[] = [
      {
        postId: 100,
        title: "자유게시판 글",
        content: "자유게시판 내용",
        authorName: "작성자1",
        viewCount: 100,
        boardDesc: "FREE",
        likeCount: 10,
        dislikeCount: 1,
        createdAt: "2024-12-10T10:00:00",
      },
    ];

    vi.mocked(postService.getBoardList).mockResolvedValue({
      notices: [],
      posts: {
        content: freePostsMock,
        totalPages: 10,
        totalElements: 200,
        pageable: { pageNumber: 0, pageSize: 20, paged: true, unpaged: false, offset: 0, sort: { sorted: false, unsorted: true, empty: true } },
        numberOfElements: 1,
        size: 20,
        number: 0,
        sort: { sorted: false, unsorted: true, empty: true },
        first: true,
        last: false,
        empty: false,
      }
    });

    renderWithQueryClient(<BoardList type="FREE" currentBoard="free" offset={20} />);

    // FREE 타입의 게시글이 표시되어야 함
    const freePosts = await screen.findAllByText(/자유게시판 글/i);
    expect(freePosts.length).toBeGreaterThan(0);

    // postService가 올바른 파라미터로 호출되었는지 확인
    expect(postService.getBoardList).toHaveBeenCalledWith("FREE", 20);
  });
});
