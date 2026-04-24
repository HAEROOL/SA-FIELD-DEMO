import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeagueRanking from '@/components/league/LeagueRanking';
import { leagueService } from '@/apis/leagueService';
import { renderWithProviders } from '../../utils/test-utils';

// Mock leagueService
vi.mock('@/apis/leagueService', () => ({
  leagueService: {
    getTopRankings: vi.fn(),
    getLeagueList: vi.fn(),
    getPlayerList: vi.fn(),
  },
}));

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('LeagueRanking 컴포넌트', () => {
  beforeEach(() => {
    const mappedClans = Array(30).fill(null).map((_, index) => ({
      clanId: index + 1,
      clanName: `Clan ${index + 1}`,
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      nexonClanId: `nx-${index + 1}`,
      division: 1,
      ladderPoints: 2000 + index,
      seasonWins: 10 + index,
      seasonLosses: 5,
      seasonDraws: 0,
    }));
    
    mappedClans[0].clanName = "Ultron";

    vi.mocked(leagueService.getLeagueList).mockResolvedValue(mappedClans);
  });

  it('클랜 랭킹이 표시되어야 한다', async () => {
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={vi.fn()} />);
    
    expect(await screen.findByText("Ultron")).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Win Rate/i })).toBeInTheDocument();
  });

  it('리그 부 선택 탭이 표시되어야 한다', async () => {
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={vi.fn()} />);
    
    await screen.findByText("Ultron");

    expect(screen.getByRole('button', { name: /1부/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2부/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3부/i })).toBeInTheDocument();
  });

  it('리그 부 탭 클릭 시 onDivisionChange가 호출되어야 한다', async () => {
    const handleDivisionChange = vi.fn();
    const user = userEvent.setup();
    
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={handleDivisionChange} />);
    
    await screen.findByText("Ultron");

    const div2Tab = screen.getByRole('button', { name: /2부/i });
    await user.click(div2Tab);

    expect(handleDivisionChange).toHaveBeenCalledWith('2');
  });

  it('클랜 랭킹 데이터가 올바르게 표시되어야 한다', async () => {
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={vi.fn()} />);
    expect(await screen.findByText('Ultron')).toBeInTheDocument();
  });

  it('1~3위 순위 뱃지가 다른 색상으로 표시되어야 한다', async () => {
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={vi.fn()} />);
    await screen.findByText('Ultron');

    const yellowBadge = document.querySelector('.bg-yellow-400');
    expect(yellowBadge).toBeInTheDocument();
  });

  it('활성 부 정보가 표시되어야 한다', async () => {
    renderWithProviders(<LeagueRanking activeDivision="1" onDivisionChange={vi.fn()} />);
    expect(await screen.findByText(/1부 리그 기준/i)).toBeInTheDocument();
  });
});
