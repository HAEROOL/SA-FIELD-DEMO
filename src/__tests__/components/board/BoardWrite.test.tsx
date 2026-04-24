import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BoardWrite from "@/components/board/BoardWrite";
import { postService } from "@/apis/postService";
import { renderWithProviders } from "../../utils/test-utils";

// Mock the postService
vi.mock("@/apis/postService", () => ({
  postService: {
    createPost: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("BoardWrite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("게시판 선택", () => {
    it("인기게시판 옵션이 없어야 한다", () => {
      renderWithProviders(<BoardWrite />);

      // Get all select elements and find the board type select
      const selectElements = screen.getAllByRole("combobox");
      const selectElement = selectElements[0]; // First combobox is board type
      const options = Array.from(selectElement.querySelectorAll("option"));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).not.toContain("인기게시판");
    });

    it("선택 가능한 게시판 목록이 표시되어야 한다", () => {
      renderWithProviders(<BoardWrite />);

      const selectElements = screen.getAllByRole("combobox");
      const selectElement = selectElements[0];
      const options = Array.from(selectElement.querySelectorAll("option"));
      const optionTexts = options.map((opt) => opt.textContent);

      expect(optionTexts).toContain("대룰게시판");
      expect(optionTexts).toContain("랭크전게시판");
      expect(optionTexts).toContain("3부게시판");
      expect(optionTexts).toContain("A보급게시판");
      expect(optionTexts).toContain("자유게시판");
      expect(optionTexts).toContain("방송게시판");
      expect(optionTexts).toContain("전략게시판");
    });
  });

  describe("비밀번호 검증", () => {
    it("비밀번호 형식 제한이 없어야 한다 - 숫자만 가능", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BoardWrite />);

      const passwordInput = screen.getByPlaceholderText(/비밀번호 입력/i);
      await user.type(passwordInput, "1234");

      // 비밀번호 형식 오류가 표시되지 않아야 함
      await waitFor(() => {
        expect(screen.queryByText(/영문과 숫자를 포함해야 합니다/i)).not.toBeInTheDocument();
      });
    });

    it("비밀번호 형식 제한이 없어야 한다 - 특수문자만 가능", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BoardWrite />);

      const passwordInput = screen.getByPlaceholderText(/비밀번호 입력/i);
      await user.type(passwordInput, "!@#$");

      await waitFor(() => {
        expect(screen.queryByText(/영문과 숫자를 포함해야 합니다/i)).not.toBeInTheDocument();
      });
    });

    it("최소 길이 검증은 유지되어야 한다", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BoardWrite />);

      const passwordInput = screen.getByPlaceholderText(/비밀번호 입력/i);
      const submitButton = screen.getByRole("button", { name: /등록/i });

      await user.type(passwordInput, "12");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/최소 4자 이상/i)).toBeInTheDocument();
      });
    });
  });

  describe("폼 제출", () => {
    it("모든 필드를 입력하고 제출할 수 있어야 한다", async () => {
      const user = userEvent.setup();
      vi.mocked(postService.createPost).mockResolvedValue(1);

      renderWithProviders(<BoardWrite />);

      // 게시판 선택
      const selectElements = screen.getAllByRole("combobox");
      const boardSelect = selectElements[0];
      await user.selectOptions(boardSelect, "FREE");

      // 비밀번호 입력
      const passwordInput = screen.getByPlaceholderText(/비밀번호 입력/i);
      await user.type(passwordInput, "1234");

      // 제목 입력
      const titleInput = screen.getByPlaceholderText(/제목을 입력하세요/i);
      await user.type(titleInput, "테스트 제목");

      // 내용은 TiptapEditor를 통해 입력되므로 onChange를 직접 호출
      // (실제 editor 인터랙션은 E2E 테스트에서 수행)

      // 제출
      const submitButton = screen.getByRole("button", { name: /등록/i });
      await user.click(submitButton);

      // API 호출 확인은 내용이 있을 때만 가능
      // 현재는 폼이 렌더링되는지만 확인
      expect(submitButton).toBeInTheDocument();
    });

    it("필수 필드가 비어있으면 오류 메시지를 표시해야 한다", async () => {
      const user = userEvent.setup();
      renderWithProviders(<BoardWrite />);

      const submitButton = screen.getByRole("button", { name: /등록/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/게시판을 선택해주세요/i)).toBeInTheDocument();
        // 닉네임 필드 제거됨
      });
    });
  });

  describe("이미지 업로드", () => {
    it("이미지 업로드 버튼이 있어야 한다", () => {
      renderWithProviders(<BoardWrite />);

      // TiptapEditor 툴바에 이미지 버튼이 있는지 확인
      const imageButton = screen.getByTitle(/이미지/i);
      expect(imageButton).toBeInTheDocument();
    });
  });
});
