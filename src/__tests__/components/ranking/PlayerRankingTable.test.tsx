import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PlayerRankingTable, { PlayerRankingItem } from '@/components/ranking/PlayerRankingTable';

describe('PlayerRankingTable 컴포넌트', () => {
  const mockData: PlayerRankingItem[] = [
    {
      id: "1",
      rank: 1,
      name: "Player1",
      clanName: "TestClan",
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      wins: 15,
      losses: 5,
      winRate: 75.0,
      points: 2000,
    },
    {
      id: "2",
      rank: 2,
      name: "Player2",
      clanName: undefined,
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      wins: 12,
      losses: 8,
      winRate: 60.0,
      points: 1800,
    },
  ];

  it('개인 랭킹 데이터를 올바르게 렌더링해야 한다', () => {
    render(<PlayerRankingTable data={mockData} />);

    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });

  it('승률과 래더 점수를 표시해야 한다', () => {
    render(<PlayerRankingTable data={mockData} />);

    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('2,000점')).toBeInTheDocument();
  });

  it('빈 데이터일 때 emptyMessage를 표시해야 한다', () => {
    render(<PlayerRankingTable data={[]} emptyMessage="플레이어가 없습니다" />);

    expect(screen.getByText('플레이어가 없습니다')).toBeInTheDocument();
  });

  it('로딩 상태를 표시해야 한다', () => {
    render(<PlayerRankingTable data={[]} loading={true} />);

    expect(screen.getByText('데이터를 불러오는 중입니다...')).toBeInTheDocument();
  });

  it('클랜이 없는 플레이어에 대해 placeholder를 표시해야 한다', () => {
    render(<PlayerRankingTable data={[mockData[1]]} />);

    // 클랜 이름이 없는 플레이어의 placeholder div가 있어야 함
    // 클랜 이름이 없는 플레이어의 경우 ClanLogo fallback이 표시되어야 함
    expect(screen.getByAltText('기본 클랜 로고')).toBeInTheDocument();
  });

  it('순위 뱃지를 올바르게 렌더링해야 한다', () => {
    render(<PlayerRankingTable data={mockData} />);

    // 1위와 2위 뱃지가 렌더링되어야 함
    const badges = screen.getAllByText(/^[12]$/);
    expect(badges).toHaveLength(2);
  });
});
