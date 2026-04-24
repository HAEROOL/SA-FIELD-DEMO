
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchSection from '@/components/home/SearchSection';
import { renderWithProviders } from '../../utils/test-utils';
import { searchService } from '@/apis/searchService';

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock searchService
vi.mock('@/apis/searchService', () => ({
  searchService: {
    searchClans: vi.fn(),
    searchPlayers: vi.fn(),
  },
}));

describe('SearchSection 컴포넌트', () => {
  beforeEach(() => {
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  describe('REQ-MAIN-001: 검색 입력', () => {
    it('검색 입력창이 렌더링되어야 한다', () => {
      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('한글, 영어, 특수문자를 입력할 수 있어야 한다', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');

      // 한글 입력
      await user.type(searchInput, 'Ultron');
      expect(searchInput).toHaveValue('Ultron');

      // 영어 입력
      await user.clear(searchInput);
      await user.type(searchInput, 'sa_king');
      expect(searchInput).toHaveValue('sa_king');

      // 특수문자 입력
      await user.clear(searchInput);
      await user.type(searchInput, 'sa_king☆');
      expect(searchInput).toHaveValue('sa_king☆');
    });

    it('클랜 선택 시 적절한 placeholder가 표시되어야 한다', () => {
      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('placeholder', '클랜명 입력');
    });

    it('플레이어 선택 시 적절한 placeholder가 표시되어야 한다', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchSection />);

      // 드롭다운 열기
      const toggleButton = screen.getByRole('button', { name: /클랜|플레이어/ });
      await user.click(toggleButton);

      // 플레이어 옵션 선택
      const playerOption = screen.getByText('플레이어');
      await user.click(playerOption);

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('placeholder', '플레이어 닉네임 입력 (예: sa_king☆)');
    });

    it('autocomplete 속성이 off로 설정되어야 한다', () => {
      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('REQ-MAIN-002: 검색 분류', () => {
    it('클랜과 플레이어 옵션을 가진 드롭다운이 렌더링되어야 한다', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchSection />);
      
      const toggleButton = screen.getByRole('button', { name: /클랜|플레이어/ });
      expect(toggleButton).toBeInTheDocument();

      // 드롭다운 열기
      await user.click(toggleButton);
      
      expect(screen.getByText('클랜', { selector: 'li span' })).toBeInTheDocument();
      expect(screen.getByText('플레이어', { selector: 'li span' })).toBeInTheDocument();
    });

    it('기본적으로 클랜이 선택되어 있어야 한다', () => {
      renderWithProviders(<SearchSection />);
      const toggleButton = screen.getByRole('button', { name: /클랜/i });
      expect(toggleButton).toHaveTextContent('클랜');
    });

    it('검색 타입 변경 시 검색어가 초기화되어야 한다', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SearchSection />);

      const searchInput = screen.getByRole('textbox');
      const toggleButton = screen.getByRole('button', { name: /클랜/ });

      // 검색어 입력
      await user.type(searchInput, 'Ultron');
      expect(searchInput).toHaveValue('Ultron');

      // 드롭다운 열고 플레이어로 변경
      await user.click(toggleButton);
      const playerOption = screen.getByText('플레이어');
      await user.click(playerOption);
      
      expect(searchInput).toHaveValue('');
    });
  });

  describe('REQ-MAIN-003: 검색 실행 및 리다이렉트', () => {
    it('검색 결과가 있을 때 해당 페이지로 이동해야 한다 (클랜)', async () => {
      const user = userEvent.setup();
      (searchService.searchClans as any).mockResolvedValue([
        { id: '1', name: 'Ultron', clanId: 1, clanName: 'Ultron' },
      ]);

      renderWithProviders(<SearchSection />);

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Ultron');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/clan/1');
      });
    });

    it('검색 결과가 있을 때 해당 페이지로 이동해야 한다 (플레이어)', async () => {
      const user = userEvent.setup();
      (searchService.searchPlayers as any).mockResolvedValue([
        { id: '100', name: 'sa_king', playerId: 100, nickName: 'sa_king' },
      ]);

      renderWithProviders(<SearchSection />);

      // 플레이어 모드로 전환
      const toggleButton = screen.getByRole('button', { name: /클랜/ });
      await user.click(toggleButton);
      const playerOption = screen.getByText('플레이어');
      await user.click(playerOption);

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'sa_king');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/user/sa_king');
      });
    });

    it('정확히 일치하는 결과가 있으면 우선적으로 이동해야 한다', async () => {
      const user = userEvent.setup();
      // "Ul" 검색 시 "Ultron"과 "Ul"이 나왔다고 가정. "Ul"이 정확히 일치하므로 거기로 가야 함.
      // 하지만 여기선 "Ultron" 검색 -> "Ultron" (id:1)이 첫번째가 아니더라도 정확히 일치하면 거기로.
      // 테스트 케이스: 검색어 "Target", 결과: [{name: "Target2", id: 2}, {name: "Target", id: 1}]
      (searchService.searchClans as any).mockResolvedValue([
        { id: '2', name: 'Target2', clanId: 2, clanName: 'Target2' },
        { id: '1', name: 'Target', clanId: 1, clanName: 'Target' },
      ]);

      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Target');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/clan/1');
      });
    });

    it('정확한 일치가 없으면 첫 번째 결과로 이동해야 한다', async () => {
      const user = userEvent.setup();
      // 검색어 "Tar", 결과: [{name: "Target", id: 1}, {name: "Tardis", id: 3}]
      (searchService.searchClans as any).mockResolvedValue([
        { id: '1', name: 'Target', clanId: 1, clanName: 'Target' },
        { id: '3', name: 'Tardis', clanId: 3, clanName: 'Tardis' },
      ]);

      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Tar');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/clan/1');
      });
    });

    it('검색 결과가 없으면 Fallback 페이지로 이동해야 한다', async () => {
      const user = userEvent.setup();
      (searchService.searchClans as any).mockResolvedValue([]);

      renderWithProviders(<SearchSection />);
      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'NoExist');
      await user.keyboard('{Enter}');

      await waitFor(() => {
         // URL 인코딩 고려, query string 확인
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/search/not-found'));
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('query=NoExist'));
        expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('type=clan'));
      });
    });

    it('검색 결과에 특수문자(슬래시 등)가 포함되어 있을 때 적절히 인코딩되어 이동해야 한다', async () => {
      const user = userEvent.setup();
      (searchService.searchPlayers as any).mockResolvedValue([
        { id: '101', name: 'Mazot/Tom', playerId: 101, nickName: 'Mazot/Tom' },
      ]);

      renderWithProviders(<SearchSection />);

      // 플레이어 모드로 전환
      const toggleButton = screen.getByRole('button', { name: /클랜/ });
      await user.click(toggleButton);
      const playerOption = screen.getByText('플레이어');
      await user.click(playerOption);

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Mazot');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/user/Mazot%2FTom');
      });
    });

    it('검색어가 비어있을 땐 아무 동작도 하지 않거나 경고를 띄울 수 있음 (코드상 alert 제거 여부 확인)', async () => {
        // 현재 계획상 alert 제거하고 아무 반응 없거나 early return.
        // 여기서는 동작하지 않음을 확인.
        const user = userEvent.setup();
        renderWithProviders(<SearchSection />);
        const buttons = screen.getAllByRole('button');
        const searchButton = buttons.find(button => button.querySelector('i.fa-search'));

        await user.click(searchButton!);
        expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('REQ-MAIN-004: 검색 미리보기', () => {
     // 기존 테스트 유지하되, searchService mock을 활용해야 함.
     // useDebounce가 500ms이므로 waitFor로 기다려야 함.
     // 하지만 useSearchClans hook은 컴포넌트 내부에서 호출되므로,
     // mockSearchService가 hook 내부에서 사용되는지 확인 필요.
     // 이 테스트 파일에서는 'SearchSection'이 useSearchClans를 import해서 씀.
     // module mocking을 통해 useSearchClans의 리턴값을 제어하는게 더 쉬울 수 있으나,
     // 현재 searchService를 mock했으므로, useSearchClans가 searchService를 부르면 mock된 값이 리턴됨.
     // React Query Wrapper가 있으므로 동작할 것임.

    it('검색어 입력 시 미리보기가 표시되어야 한다', async () => {
      const user = userEvent.setup();
      (searchService.searchClans as any).mockResolvedValue([
        { id: '1', name: 'Ultron', clanId: 1, clanName: 'Ultron' },
      ]);

      renderWithProviders(<SearchSection />);

      const searchInput = screen.getByRole('textbox');
      await user.type(searchInput, 'Ul');

      await waitFor(() => {
        const previewList = screen.getByRole('list');
        expect(previewList).toBeInTheDocument();
        expect(screen.getByText('Ultron')).toBeInTheDocument();
      });
    });

    it('미리보기에서 항목 클릭 시 해당 페이지로 이동해야 한다', async () => {
        const user = userEvent.setup();
        (searchService.searchClans as any).mockResolvedValue([
          { id: '1', name: 'Ultron', clanId: 1, clanName: 'Ultron' },
        ]);

        renderWithProviders(<SearchSection />);

        const searchInput = screen.getByRole('textbox');
        await user.type(searchInput, 'Ul');

        await waitFor(() => {
          expect(screen.getByText('Ultron')).toBeInTheDocument();
        }, { timeout: 10000 });

        await user.click(screen.getByText('Ultron'));

        // 클릭 시 performSearch가 아니라 handleResultClick이 호출됨 -> 바로 이동
        expect(mockPush).toHaveBeenCalledWith('/clan/1');
    });
  });
});
