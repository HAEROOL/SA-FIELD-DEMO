import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RankingHeader from '@/components/ranking/RankingHeader';

describe('RankingHeader 컴포넌트', () => {
  it('PLAYER RANKING 타이틀이 렌더링되어야 한다', () => {
    render(<RankingHeader />);
    expect(screen.getByText('PLAYER RANKING')).toBeInTheDocument();
  });

  it('트로피 아이콘이 렌더링되어야 한다', () => {
    const { container } = render(<RankingHeader />);
    const icon = container.querySelector('.fa-trophy');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('text-yellow-400');
  });

  it('플레이어 랭킹 설명이 렌더링되어야 한다', () => {
    render(<RankingHeader />);
    expect(screen.getByText(/2024 Season 14/)).toBeInTheDocument();
  });
});
