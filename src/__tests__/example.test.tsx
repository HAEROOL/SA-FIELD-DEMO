import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// 간단한 예제 컴포넌트
function HelloWorld() {
  return <div>Hello World</div>;
}

describe('Example Test', () => {
  it('renders hello world', () => {
    render(<HelloWorld />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('basic math works', () => {
    expect(1 + 1).toBe(2);
  });
});
