"use client";

import { useEffect, useRef, useState } from "react";

interface SlideItemProps {
  variant?: "default" | "premium";
  badge?: string;
  category: string;
  title: string;
  description: string;
  actionText: string;
  actionIcon?: string;
  backgroundIcon?: string;
}

function SlideItem({
  variant = "default",
  badge,
  category,
  title,
  description,
  actionText,
  actionIcon,
  backgroundIcon,
}: SlideItemProps) {
  if (variant === "premium") {
    return (
      <div className="snap-center shrink-0 w-[85%] md:w-[45%] lg:w-[32%] bg-linear-to-br from-brand-600 to-brand-700 rounded-xl p-5 border border-brand-500 hover:shadow-lg hover:shadow-brand-500/20 transition-all cursor-pointer shadow-sm relative overflow-hidden">
        {backgroundIcon && (
          <i
            className={`${backgroundIcon} absolute -right-4 -bottom-4 text-6xl text-white/10`}
          ></i>
        )}
        <h3 className="text-xs font-bold text-brand-200 uppercase mb-2">
          {category}
        </h3>
        <div className="text-white font-bold text-lg mb-1">{title}</div>
        <p className="text-xs text-brand-100">{description}</p>
        <div className="mt-4 text-white text-sm font-bold flex items-center gap-1 bg-white/20 w-fit px-3 py-1 rounded-full">
          {actionText}
        </div>
      </div>
    );
  }

  return (
    <div className="snap-center shrink-0 w-[85%] md:w-[45%] lg:w-[32%] bg-white dark:bg-brand-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-brand-500 transition-colors cursor-pointer relative overflow-hidden shadow-sm">
      {badge && (
        <div className="absolute top-0 right-0 p-2">
          <span className="bg-brand-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
            {badge}
          </span>
        </div>
      )}
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
        {category}
      </h3>
      <div className="text-gray-800 dark:text-white font-bold text-lg mb-1">
        {title}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      <div className="mt-4 text-brand-500 text-sm font-bold flex items-center gap-1">
        {actionText} {actionIcon && <i className={actionIcon} data-testid={actionIcon.includes('envelope') ? 'envelope-icon' : undefined}></i>}
      </div>
    </div>
  );
}

export default function SliderSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0]?.clientWidth || 0;
      const gap = 16; // gap-4 = 16px
      sliderRef.current.scrollTo({
        left: currentIndex * (slideWidth + gap),
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <div className="w-full relative group">
      {/* Left Fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white dark:from-brand-900/90 to-transparent z-10 pointer-events-none md:hidden"></div>
      {/* Right Fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white dark:from-brand-900/90 to-transparent z-10 pointer-events-none md:hidden"></div>

      <div
        ref={sliderRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        <SlideItem
          badge="AD"
          category="Premium Service"
          title="전적 즉시 갱신권"
          description="대기시간 없이 내 기록을 최신으로!"
          actionText="구매하러 가기"
          actionIcon="fas fa-arrow-right"
        />
        <SlideItem
          category="Event"
          title="닉네임 변경 50% 할인"
          description="이번 주말 한정 특가 이벤트"
          actionText="자세히 보기"
          actionIcon="fas fa-arrow-right"
        />
        <SlideItem
          variant="premium"
          category="Recruit"
          title="리그 운영진 모집"
          description="서든어택 리그를 함께 만들어갈 분을 찾습니다."
          actionText="지원하기"
          backgroundIcon="fas fa-star"
        />
        <SlideItem
          category="Banner"
          title="sa.field 광고 문의"
          description="클랜 홍보 배너를 게시해보세요."
          actionText="문의하기"
          actionIcon="fas fa-arrow-right"
        />
      </div>
    </div>
  );
}
