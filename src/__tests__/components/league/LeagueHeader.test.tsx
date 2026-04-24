import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeagueHeader from '@/components/league/LeagueHeader';

describe('LeagueHeader 컴포넌트', () => {
  it('리그 헤더가 렌더링되어야 한다', () => {
    render(<LeagueHeader />);

    expect(screen.getByText('OFFICIAL LEAGUE')).toBeInTheDocument();
    expect(screen.getByText(/2024 Season 14 진행 중/i)).toBeInTheDocument();
  });

  it('트로피 아이콘이 표시되어야 한다', () => {
    render(<LeagueHeader />);

    const trophy = document.querySelector('.fa-trophy');
    expect(trophy).toBeInTheDocument();
  });
});
