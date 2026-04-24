import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SliderSection from '@/components/home/SliderSection';

describe('SliderSection 컴포넌트', () => {
  beforeEach(() => {
    Element.prototype.scrollTo = vi.fn();
  });

  describe('REQ-MAIN-007: 라이브 매치 및 광고', () => {
    it('슬라이더 컨테이너가 렌더링되어야 한다', () => {
      render(<SliderSection />);

      const slider = document.querySelector('.flex.overflow-x-auto');
      expect(slider).toBeInTheDocument();
    });

    it('4개의 광고 슬라이드가 표시되어야 한다', () => {
      render(<SliderSection />);

      expect(screen.getByText('전적 즉시 갱신권')).toBeInTheDocument();
      expect(screen.getByText('닉네임 변경 50% 할인')).toBeInTheDocument();
      expect(screen.getByText('리그 운영진 모집')).toBeInTheDocument();
      expect(screen.getByText('sa.field 광고 문의')).toBeInTheDocument();
    });

    it('각 슬라이드에 카테고리가 표시되어야 한다', () => {
      render(<SliderSection />);

      expect(screen.getByText('Premium Service')).toBeInTheDocument();
      expect(screen.getByText('Event')).toBeInTheDocument();
      expect(screen.getByText('Recruit')).toBeInTheDocument();
      expect(screen.getByText('Banner')).toBeInTheDocument();
    });

    it('각 슬라이드에 설명이 표시되어야 한다', () => {
      render(<SliderSection />);

      expect(screen.getByText('대기시간 없이 내 기록을 최신으로!')).toBeInTheDocument();
      expect(screen.getByText('이번 주말 한정 특가 이벤트')).toBeInTheDocument();
      expect(screen.getByText(/서든어택 리그를 함께 만들어갈/i)).toBeInTheDocument();
      expect(screen.getByText('클랜 홍보 배너를 게시해보세요.')).toBeInTheDocument();
    });

    it('각 슬라이드에 액션 버튼이 표시되어야 한다', () => {
      render(<SliderSection />);

      expect(screen.getByText(/구매하러 가기/i)).toBeInTheDocument();
      expect(screen.getByText(/자세히 보기/i)).toBeInTheDocument();
      expect(screen.getByText(/지원하기/i)).toBeInTheDocument();
      expect(screen.getByText(/문의하기/i)).toBeInTheDocument();
    });

    it('첫 번째 슬라이드에 AD 배지가 표시되어야 한다', () => {
      render(<SliderSection />);

      const adBadge = screen.getByText('AD');
      expect(adBadge).toBeInTheDocument();
      expect(adBadge).toHaveClass('bg-brand-500');
    });


  });

  describe('슬라이더 기능', () => {
    it('슬라이더에 overflow-x-auto 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const slider = document.querySelector('.overflow-x-auto');
      expect(slider).toBeInTheDocument();
    });

    it('슬라이더에 snap 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const slider = document.querySelector('.snap-x.snap-mandatory');
      expect(slider).toBeInTheDocument();
    });

    it('각 슬라이드에 snap-center 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.snap-center');
      expect(slides.length).toBe(4);
    });

    it('각 슬라이드에 shrink-0 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.shrink-0');
      expect(slides.length).toBe(4);
    });
  });

  describe('반응형 디자인', () => {
    it('슬라이드에 반응형 너비 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const firstSlide = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstSlide).toHaveClass('w-[85%]', 'md:w-[45%]', 'lg:w-[32%]');
    });

    it('좌측 페이드 그라디언트가 있어야 한다', () => {
      render(<SliderSection />);

      const leftFade = document.querySelector('.bg-linear-to-r.from-white');
      expect(leftFade).toBeInTheDocument();
    });

    it('우측 페이드 그라디언트가 있어야 한다', () => {
      render(<SliderSection />);

      const rightFade = document.querySelector('.bg-linear-to-l.from-white');
      expect(rightFade).toBeInTheDocument();
    });

    it('페이드 그라디언트에 pointer-events-none 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const fades = document.querySelectorAll('.pointer-events-none');
      expect(fades.length).toBeGreaterThanOrEqual(2);
    });

    it('페이드가 모바일에서만 표시되어야 한다', () => {
      render(<SliderSection />);

      const leftFade = document.querySelector('.bg-linear-to-r');
      expect(leftFade).toHaveClass('md:hidden');
    });
  });

  describe('스타일링 및 다크 모드', () => {
    it('슬라이드 카드에 다크 모드 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('dark:bg-brand-800');
    });

    it('슬라이드 카드에 호버 효과가 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('hover:border-brand-500');
    });

    it('슬라이드 카드에 cursor-pointer 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('cursor-pointer');
    });

    it('리크루트 슬라이드에 gradient 배경이 있어야 한다', () => {
      render(<SliderSection />);

      const recruitCard = screen.getByText('리그 운영진 모집').closest('.snap-center');
      expect(recruitCard).toHaveClass('bg-linear-to-br', 'from-brand-600', 'to-brand-700');
    });

    it('리크루트 슬라이드에 별 아이콘 배경이 있어야 한다', () => {
      render(<SliderSection />);

      const recruitCard = screen.getByText('리그 운영진 모집').closest('.snap-center');
      const starIcon = recruitCard?.querySelector('i.fa-star');
      expect(starIcon).toBeInTheDocument();
    });

    it('페이드 그라디언트에 다크 모드 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const leftFade = document.querySelector('.bg-linear-to-r');
      expect(leftFade).toHaveClass('dark:from-brand-900/90');
    });
  });

  describe('레이아웃', () => {
    it('슬라이더에 적절한 간격이 있어야 한다', () => {
      render(<SliderSection />);

      const slider = document.querySelector('.flex.overflow-x-auto');
      expect(slider).toHaveClass('gap-4');
    });

    it('슬라이더에 하단 패딩이 있어야 한다', () => {
      render(<SliderSection />);

      const slider = document.querySelector('.flex.overflow-x-auto');
      expect(slider).toHaveClass('pb-4');
    });

    it('슬라이드 카드에 적절한 패딩이 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('p-5');
    });

    it('슬라이드 카드에 rounded 클래스가 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('rounded-xl');
    });
  });

  describe('접근성', () => {
    it('모든 슬라이드가 접근 가능해야 한다', () => {
      render(<SliderSection />);

      expect(screen.getByText('전적 즉시 갱신권')).toBeInTheDocument();
      expect(screen.getByText('닉네임 변경 50% 할인')).toBeInTheDocument();
      expect(screen.getByText('리그 운영진 모집')).toBeInTheDocument();
      expect(screen.getByText('sa.field 광고 문의')).toBeInTheDocument();
    });

    it('카테고리 텍스트가 대문자로 표시되어야 한다', () => {
      render(<SliderSection />);

      const categories = document.querySelectorAll('.uppercase');
      expect(categories.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('컨텐츠 우선순위', () => {
    it('프리미엄 서비스 광고가 첫 번째여야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.snap-center');
      const firstSlide = slides[0];
      expect(firstSlide?.textContent).toContain('전적 즉시 갱신권');
    });

    it('이벤트 광고가 두 번째여야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.snap-center');
      const secondSlide = slides[1];
      expect(secondSlide?.textContent).toContain('닉네임 변경 50% 할인');
    });

    it('리크루트 광고가 세 번째여야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.snap-center');
      const thirdSlide = slides[2];
      expect(thirdSlide?.textContent).toContain('리그 운영진 모집');
    });

    it('배너 문의가 네 번째여야 한다', () => {
      render(<SliderSection />);

      const slides = document.querySelectorAll('.snap-center');
      const fourthSlide = slides[3];
      expect(fourthSlide?.textContent).toContain('sa.field 광고 문의');
    });
  });

  describe('시각적 요소', () => {
    it('AD 배지가 적절한 위치에 있어야 한다', () => {
      render(<SliderSection />);

      const adBadge = screen.getByText('AD').closest('div');
      expect(adBadge).toHaveClass('absolute', 'top-0', 'right-0');
    });

    it('AD 배지에 적절한 스타일이 있어야 한다', () => {
      render(<SliderSection />);

      const adBadge = screen.getByText('AD');
      expect(adBadge).toHaveClass('bg-brand-500', 'text-white', 'font-bold');
    });

    it('리크루트 슬라이드의 지원하기 버튼이 강조되어야 한다', () => {
      render(<SliderSection />);

      const recruitButton = screen.getByText('지원하기').closest('div');
      expect(recruitButton).toHaveClass('bg-white/20', 'rounded-full');
    });

    it('슬라이드에 shadow 효과가 있어야 한다', () => {
      render(<SliderSection />);

      const firstCard = screen.getByText('전적 즉시 갱신권').closest('.snap-center');
      expect(firstCard).toHaveClass('shadow-sm');
    });

    it('리크루트 슬라이드에 호버 시 shadow 효과가 강화되어야 한다', () => {
      render(<SliderSection />);

      const recruitCard = screen.getByText('리그 운영진 모집').closest('.snap-center');
      expect(recruitCard).toHaveClass('hover:shadow-lg', 'hover:shadow-brand-500/20');
    });
  });
});
