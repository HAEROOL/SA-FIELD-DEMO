# SA FIELD 디자인 시스템

이 디렉토리는 SA FIELD 프로젝트의 디자인 시스템을 포함합니다.

## 파일 구조

```
src/styles/
├── design-system.ts     # TypeScript 디자인 토큰 (프로그래밍 방식으로 사용)
└── README.md           # 이 파일
```

디자인 토큰은 `src/app/globals.css`에서 CSS 변수로도 정의됩니다.

---

## 브레이크포인트 (Breakpoints)

### 정의된 브레이크포인트

```typescript
// Desktop
desktop-lg: 1920px  // Desktop Large
desktop: 1440px     // Desktop Medium

// Tablet
tablet-lg: 1080px   // Tablet Large
tablet: 800px       // Tablet Medium

// Mobile
mobile: < 800px     // Mobile
```

### Tailwind CSS 사용법

```tsx
// 예제: 반응형 레이아웃
<div className="
  grid
  grid-cols-1           // Mobile: 1 column
  md:grid-cols-2        // Tablet (800px+): 2 columns
  lg:grid-cols-3        // Tablet Large (1080px+): 3 columns
  xl:grid-cols-4        // Desktop (1440px+): 4 columns
">
  {/* Content */}
</div>

// 예제: 반응형 텍스트 크기
<h1 className="
  text-2xl              // Mobile
  md:text-3xl           // Tablet
  lg:text-4xl           // Desktop
  xl:text-5xl           // Desktop Large
">
  제목
</h1>
```

### CSS Custom Media Queries

```css
/* globals.css에 정의됨 */
@custom-media --mobile (max-width: 799px);
@custom-media --tablet (min-width: 800px);
@custom-media --tablet-lg (min-width: 1080px);
@custom-media --desktop (min-width: 1440px);
@custom-media --desktop-lg (min-width: 1920px);

/* 사용 예 */
.my-component {
  /* Mobile first */
  padding: 1rem;

  /* Tablet */
  @media (--tablet) {
    padding: 2rem;
  }

  /* Desktop */
  @media (--desktop) {
    padding: 3rem;
  }
}
```

---

## 타이포그래피 (Typography)

### 폰트 크기

```tsx
// Display (영웅 섹션, 랜딩 페이지)
<h1 className="text-[4rem]">Display Large (64px)</h1>
<h1 className="text-[3rem]">Display Medium (48px)</h1>
<h1 className="text-[2.5rem]">Display Small (40px)</h1>

// Headings (일반 제목)
<h1 className="text-[2rem]">H1 (32px)</h1>
<h2 className="text-[1.75rem]">H2 (28px)</h2>
<h3 className="text-2xl">H3 (24px)</h3>
<h4 className="text-xl">H4 (20px)</h4>
<h5 className="text-lg">H5 (18px)</h5>
<h6 className="text-base">H6 (16px)</h6>

// Body (본문)
<p className="text-lg">Body Large (18px)</p>
<p className="text-base">Body (16px)</p>
<p className="text-sm">Body Small (14px)</p>

// Utility (작은 텍스트)
<span className="text-xs">Caption (12px)</span>
```

### 폰트 굵기

```tsx
<p className="font-light">Light (300)</p>
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
<p className="font-extrabold">Extrabold (800)</p>
<p className="font-black">Black (900)</p>
```

### 행간 (Line Height)

```tsx
<p className="leading-tight">Tight (1.1)</p>
<p className="leading-snug">Snug (1.3)</p>
<p className="leading-normal">Normal (1.5)</p>
<p className="leading-relaxed">Relaxed (1.6)</p>
<p className="leading-loose">Loose (1.8)</p>
```

---

## 색상 시스템 (Colors)

### 브랜드 컬러 (Brand Colors)

```tsx
// 메인 브랜드 컬러: 황금/오렌지 (#e8a33d)
<div className="bg-brand-50">Brand 50 (가장 밝음)</div>
<div className="bg-brand-100">Brand 100</div>
<div className="bg-brand-200">Brand 200</div>
<div className="bg-brand-500">Brand 500 (메인)</div>
<div className="bg-brand-600">Brand 600</div>
<div className="bg-brand-700">Brand 700</div>
<div className="bg-brand-800">Brand 800 (다크 헤더)</div>
<div className="bg-brand-900">Brand 900 (다크 카드)</div>

// 텍스트에 사용
<p className="text-brand-500">브랜드 컬러 텍스트</p>
```

### 표면 색상 (Surface Colors)

```tsx
<div className="bg-surface-card">카드 배경</div>
<div className="bg-surface-header">헤더 배경</div>
```

### 텍스트 색상 (Text Colors)

```tsx
<p className="text-text-primary">Primary Text</p>
<p className="text-text-secondary">Secondary Text</p>
<p className="text-text-disabled">Disabled Text</p>
<p className="text-text-dark">Dark Text (라이트 모드용)</p>
```

### 테두리 색상 (Border Colors)

```tsx
<div className="border border-border-divider">Divider</div>
<div className="border border-border-light">Light Border</div>
```

### 의미론적 색상 (Semantic Colors)

```tsx
<div className="text-success">성공 (초록)</div>
<div className="text-error">에러 (빨강)</div>
<div className="text-warning">경고 (오렌지)</div>
<div className="text-info">정보 (파랑)</div>
```

### 게임 통계 색상

```tsx
<span className="text-brand-win">승리 (초록)</span>
<span className="text-brand-lose">패배 (빨강)</span>
<span className="text-brand-death">사망 (빨강)</span>
```

---

## 간격 시스템 (Spacing)

Tailwind 기본 spacing 스케일 사용 (4px 기준):

```tsx
// Padding
<div className="p-0">0px</div>
<div className="p-1">4px</div>
<div className="p-2">8px</div>
<div className="p-4">16px</div>
<div className="p-6">24px</div>
<div className="p-8">32px</div>
<div className="p-12">48px</div>
<div className="p-16">64px</div>

// Margin
<div className="m-4">Margin 16px</div>
<div className="mt-8">Margin Top 32px</div>
<div className="mx-auto">Margin Auto (수평 중앙)</div>

// Gap (Grid/Flex)
<div className="flex gap-4">Gap 16px</div>
<div className="grid gap-6">Gap 24px</div>
```

---

## 그림자 (Shadows)

### 일반 그림자

```tsx
<div className="shadow-sm">작은 그림자</div>
<div className="shadow">기본 그림자</div>
<div className="shadow-md">중간 그림자</div>
<div className="shadow-lg">큰 그림자</div>
<div className="shadow-xl">매우 큰 그림자</div>
<div className="shadow-2xl">초대형 그림자</div>
<div className="shadow-inner">안쪽 그림자</div>
```

### 브랜드 그림자

CSS 변수로 사용:

```css
.my-component {
  box-shadow: var(--shadow-brand-sm);  /* 브랜드 컬러 작은 그림자 */
  box-shadow: var(--shadow-brand-md);  /* 브랜드 컬러 중간 그림자 */
  box-shadow: var(--shadow-brand-lg);  /* 브랜드 컬러 큰 그림자 */
}
```

---

## Border Radius (모서리 둥글기)

```tsx
<div className="rounded-none">둥글지 않음 (0)</div>
<div className="rounded-sm">약간 둥글게 (2px)</div>
<div className="rounded">기본 둥글게 (4px)</div>
<div className="rounded-md">중간 둥글게 (6px)</div>
<div className="rounded-lg">많이 둥글게 (8px)</div>
<div className="rounded-xl">매우 둥글게 (12px)</div>
<div className="rounded-2xl">초대형 둥글게 (16px)</div>
<div className="rounded-3xl">극대형 둥글게 (24px)</div>
<div className="rounded-full">완전한 원형</div>
```

---

## Z-Index (계층 구조)

TypeScript에서 사용:

```typescript
import { designSystem } from '@/styles/design-system';

// 예제
const navbarStyle = {
  zIndex: designSystem.zIndex.navbar, // 50
};

const modalStyle = {
  zIndex: designSystem.zIndex.modal, // 1050
};
```

Tailwind에서 사용:

```tsx
<nav className="z-50">Navbar</nav>
<div className="z-40">Sidebar</div>
<div className="z-[1050]">Modal</div>
```

### 정의된 Z-Index 레벨

- `navbar`: 50
- `sidebar`: 40
- `dropdown`: 1000
- `sticky`: 1020
- `fixed`: 1030
- `backdrop`: 1040
- `overlay`: 1045
- `modal`: 1050
- `popover`: 1060
- `tooltip`: 1070
- `notification`: 1080

---

## 전환 & 애니메이션 (Transitions & Animations)

### 기간 (Duration)

```tsx
<div className="transition-all duration-150">빠른 전환 (150ms)</div>
<div className="transition-all duration-200">기본 전환 (200ms)</div>
<div className="transition-all duration-300">중간 전환 (300ms)</div>
<div className="transition-all duration-500">느린 전환 (500ms)</div>
```

### 타이밍 함수

```tsx
<div className="ease-linear">Linear</div>
<div className="ease-in">Ease In</div>
<div className="ease-out">Ease Out</div>
<div className="ease-in-out">Ease In Out</div>
```

### CSS 변수 사용

```css
.my-button {
  transition: var(--transition-fast);  /* 150ms */
  transition: var(--transition-base);  /* 200ms */
  transition: var(--transition-medium); /* 300ms */
  transition: var(--transition-slow);  /* 500ms */
}
```

---

## 레이아웃 (Layout)

### 컨테이너 최대 너비

```tsx
<div className="max-w-screen-sm">640px</div>
<div className="max-w-screen-md">768px</div>
<div className="max-w-screen-lg">1024px</div>
<div className="max-w-screen-xl">1280px</div>
<div className="max-w-screen-2xl">1536px</div>

// 또는 커스텀
<div className="max-w-7xl mx-auto">
  {/* 중앙 정렬된 컨테이너 */}
</div>
```

### 고정 높이

CSS 변수 사용:

```css
.navbar {
  height: var(--navbar-height); /* 64px (데스크톱) */
}

.mobile-navbar {
  height: var(--navbar-height-mobile); /* 56px */
}

.hero {
  height: var(--hero-height-desktop); /* 600px */
}

@media (--tablet) {
  .hero {
    height: var(--hero-height-tablet); /* 500px */
  }
}

@media (--mobile) {
  .hero {
    height: var(--hero-height-mobile); /* 400px */
  }
}
```

---

## 다크 모드 (Dark Mode)

### 사용법

```tsx
// 배경색
<div className="bg-white dark:bg-gray-900">
  컨텐츠
</div>

// 텍스트 색상
<p className="text-gray-900 dark:text-white">
  텍스트
</p>

// 테두리
<div className="border-gray-300 dark:border-gray-700">
  테두리
</div>

// 복합 사용
<button className="
  bg-white dark:bg-brand-800
  text-gray-900 dark:text-white
  border-gray-300 dark:border-gray-700
  hover:bg-gray-100 dark:hover:bg-gray-700
">
  버튼
</button>
```

### 커스텀 다크 모드 CSS

```css
.my-component {
  background: white;
  color: black;
}

.dark .my-component {
  background: var(--brand-900);
  color: white;
}
```

---

## 이미지 경로

프로젝트에서 사용하는 이미지는 `public/images/` 디렉토리에 저장하세요:

```
public/
└── images/
    ├── hero-background.jpg      # 홈 히어로 배경 이미지
    ├── hero-character.png       # 홈 히어로 캐릭터 이미지
    ├── logo.png                 # 로고
    └── [기타 이미지들...]
```

### 사용법

```tsx
// Next.js Image 컴포넌트
import Image from 'next/image';

<Image
  src="/images/hero-background.jpg"
  alt="Hero Background"
  width={1920}
  height={1080}
/>

// 일반 img 태그
<img src="/images/logo.png" alt="SA FIELD Logo" />

// CSS background
<div style={{ backgroundImage: "url('/images/hero-background.jpg')" }}>
  컨텐츠
</div>
```

---

## 사용 예제

### 반응형 카드 컴포넌트

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white dark:bg-surface-card
      border border-gray-200 dark:border-border-divider
      rounded-lg
      shadow-md
      p-4 md:p-6
      transition-all duration-200
      hover:shadow-lg
    ">
      {children}
    </div>
  );
}
```

### 반응형 그리드 레이아웃

```tsx
export function GridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-4 md:gap-6
      p-4 md:p-6 lg:p-8
    ">
      {children}
    </div>
  );
}
```

### 반응형 타이포그래피

```tsx
export function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="
      text-2xl md:text-3xl lg:text-4xl
      font-bold
      text-gray-900 dark:text-white
      mb-4
    ">
      {children}
    </h1>
  );
}
```

---

## 참고 자료

- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Tailwind CSS v4 마이그레이션](https://tailwindcss.com/docs/v4-migration)
- 프로젝트 디자인 시스템: `/src/styles/design-system.ts`
- 글로벌 스타일: `/src/app/globals.css`
