import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserTeammates from '@/components/user/UserTeammates';

describe('UserTeammates 컴포넌트', () => {
  it('빈 상태 메시지가 표시되어야 한다', () => {
    render(<UserTeammates />);
    
    // Empty state message
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    
    // Icon presence (users-friends based on implementation)
    const icon = document.querySelector('.fa-user-friends');
    expect(icon).toBeInTheDocument();
  });
});
