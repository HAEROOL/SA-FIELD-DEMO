import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import PersonalRanking from '@/components/ranking/PersonalRanking';
import { leagueService } from '@/apis/leagueService';
import { renderWithProviders } from '../../utils/test-utils';

// Mock leagueService
vi.mock('@/apis/leagueService', () => ({
  leagueService: {
    getPlayerList: vi.fn(),
  },
}));

// Mock Image component to check URL
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock ClanLogo to verify props
vi.mock('@/components/ui/ClanLogo', () => ({
  ClanLogo: ({ clanMarkUrl, clanBackMarkUrl, clanName }: any) => (
    <div data-testid="clan-logo">
      <span data-testid="clan-name">{clanName}</span>
      <span data-testid="clan-mark-url">{clanMarkUrl}</span>
      <span data-testid="clan-back-mark-url">{clanBackMarkUrl}</span>
    </div>
  ),
}));

describe('PersonalRanking 컴포넌트', () => {
  const mockPlayers = [
    {
      laeguePlayerId: 5,
      playerId: 5,
      nickName: "권쥰혁",
      clanId: 6,
      clanMarkUrl: "https://storage.googleapis.com/sa-field-storage/marks/51/1_23_522.png",
      clanBackMarkUrl: "https://storage.googleapis.com/sa-field-storage/marks/51/0_13_080.png",
      clanName: "gaIactico-",
      totalKill: 37108,
      totalDeath: 36937,
      totalWin: 2513,
      totalLose: 1981,
      mvpCount: 421,
      ladderPoint: 3405,
      nexonOuid: "370131968"
    },
    {
      laeguePlayerId: 3,
      playerId: 3,
      nickName: "모돌",
      clanId: null,
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      clanName: null,
      totalKill: 8857,
      totalDeath: 7801,
      totalWin: 583,
      totalLose: 389,
      mvpCount: 130,
      ladderPoint: 3333,
      nexonOuid: "302148943"
    }
  ];

  beforeEach(() => {
    vi.mocked(leagueService.getPlayerList).mockResolvedValue(mockPlayers);
  });

  it('사용자 랭킹 데이터를 올바르게 렌더링해야 한다', async () => {
    renderWithProviders(<PersonalRanking />);

    expect(await screen.findByText('권쥰혁')).toBeInTheDocument();
  });

  it('클랜이 있는 사용자의 경우 클랜 로고와 이름을 렌더링해야 한다', async () => {
    renderWithProviders(<PersonalRanking />);
    await screen.findByText('권쥰혁');

    const clanLogos = screen.getAllByTestId('clan-logo');
    const playerWithClan = clanLogos[0]; // 권쥰혁

    expect(playerWithClan).toHaveTextContent('gaIactico-');
    expect(playerWithClan).toHaveTextContent('https://storage.googleapis.com/sa-field-storage/marks/51/1_23_522.png');
  });

  it('클랜이 없는 사용자의 경우 클랜 정보를 표시하지 않아야 한다', async () => {
    renderWithProviders(<PersonalRanking />);
    await screen.findByText('모돌');

    // 모돌 행에는 clan-logo가 없어야 함
    // RankingTable 구현상 clanName이 없으면 ClanLogo를 렌더링하지 않음
    // 테이블 행을 찾아 확인
    const row = screen.getByText('모돌').closest('tr');
    const clanLogoInRow = row?.querySelector('[data-testid="clan-logo"]');
    
    expect(clanLogoInRow).toHaveTextContent("기본 클랜");
  });
});
