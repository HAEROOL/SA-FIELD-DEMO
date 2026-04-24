import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button 컴포넌트', () => {
  it('버튼이 렌더링되어야 한다', () => {
    render(<Button>클릭</Button>);
    expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument();
  });

  it('클릭 이벤트가 동작해야 한다', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>클릭</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태일 때 클릭이 동작하지 않아야 한다', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick} disabled>클릭</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('isLoading 상태일 때 로딩 스피너가 표시되어야 한다', () => {
    render(<Button isLoading>저장</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // 로딩 스피너는 span으로 렌더링됨
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('variant prop에 따라 다른 스타일이 적용되어야 한다', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-600');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-lose');
  });

  it('size prop에 따라 다른 크기가 적용되어야 한다', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-xs');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3.5', 'text-base');
  });

  it('커스텀 className이 적용되어야 한다', () => {
    render(<Button className="custom-class">버튼</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
