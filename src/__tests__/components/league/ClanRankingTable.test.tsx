import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ClanRankingTable, { ClanRankingItem } from '@/components/league/ClanRankingTable';

describe('ClanRankingTable 컴포넌트', () => {
  const mockData: ClanRankingItem[] = [
    {
      id: 1,
      rank: 1,
      name: "TestClan",
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      wins: 10,
      losses: 2,
      winRate: 83.33,
      points: 1500,
    },
    {
      id: 2,
      rank: 2,
      name: "AnotherClan",
      clanMarkUrl: null,
      clanBackMarkUrl: null,
      wins: 8,
      losses: 4,
      winRate: 66.67,
      points: 1200,
    },
  ];

  it('클랜 랭킹 데이터를 올바르게 렌더링해야 한다', () => {
    render(<ClanRankingTable data={mockData} />);

    expect(screen.getByText('TestClan')).toBeInTheDocument();
    expect(screen.getByText('AnotherClan')).toBeInTheDocument();
  });

  it('승률과 래더 점수를 표시해야 한다', () => {
    render(<ClanRankingTable data={mockData} />);

    expect(screen.getByText('83.3%')).toBeInTheDocument();
    expect(screen.getByText('1,500점')).toBeInTheDocument();
  });

  it('빈 데이터일 때 emptyMessage를 표시해야 한다', () => {
    render(<ClanRankingTable data={[]} emptyMessage="클랜이 없습니다" />);

    expect(screen.getByText('클랜이 없습니다')).toBeInTheDocument();
  });

  it('로딩 상태를 표시해야 한다', () => {
    render(<ClanRankingTable data={[]} loading={true} />);

    expect(screen.getByText('데이터를 불러오는 중입니다...')).toBeInTheDocument();
  });

  it('순위 뱃지를 올바르게 렌더링해야 한다', () => {
    render(<ClanRankingTable data={mockData} />);

    // 1위와 2위 뱃지가 렌더링되어야 함
    const badges = screen.getAllByText(/^[12]$/);
    expect(badges).toHaveLength(2);
  });
});
