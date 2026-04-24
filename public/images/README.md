# SA FIELD 이미지 에셋

이 디렉토리는 SA FIELD 프로젝트에서 사용되는 모든 이미지 파일을 포함합니다.

## 필요한 이미지 목록

### 1. 홈 페이지 히어로 섹션

#### `hero-background.jpg`
- **용도**: 홈 페이지 배경 이미지
- **권장 크기**: 1920x1080px (Full HD)
- **설명**: 서든어택 캐릭터가 포함된 배경 이미지
- **포맷**: JPG (최적화된 파일 크기)
- **위치**: 현재 `/src/app/page.tsx`에서 사용 중

```tsx
// 사용 위치: src/app/page.tsx
<div style={{ backgroundImage: "url('/images/hero-background.jpg')" }}>
```

#### `hero-character.png` (선택 사항)
- **용도**: 히어로 섹션 캐릭터 이미지 (오른쪽)
- **권장 크기**: 800x1080px (세로 비율)
- **설명**: 서든어택 캐릭터 PNG (배경 투명)
- **포맷**: PNG (투명 배경)
- **참고**: 현재 코드에는 플레이스홀더만 있음

---

### 2. 로고 및 브랜딩

#### `logo.png` (선택 사항)
- **용도**: SA FIELD 로고 (PNG 버전)
- **권장 크기**: 512x512px (정사각형) 또는 가로 긴 비율
- **설명**: 투명 배경의 로고
- **포맷**: PNG
- **참고**: 현재는 Font Awesome 아이콘 + 텍스트 사용 중

#### `logo-light.svg` / `logo-dark.svg` (선택 사항)
- **용도**: 다크 모드 / 라이트 모드별 로고
- **포맷**: SVG (벡터 파일)

---

### 3. 게시판 / 커뮤니티

#### `placeholder-post.jpg`
- **용도**: 게시글 썸네일 플레이스홀더
- **권장 크기**: 1200x630px (OG 이미지 비율)
- **설명**: 기본 썸네일 이미지
- **포맷**: JPG

---

### 4. 리그 / 클랜

#### `clan-default-logo.png`
- **용도**: 클랜 로고가 없을 때 기본 이미지
- **권장 크기**: 256x256px (정사각형)
- **설명**: 기본 클랜 엠블럼
- **포맷**: PNG

#### `rank-badge-*.png`
- **용도**: 리그 순위 배지 (1위, 2위, 3위 등)
- **권장 크기**: 128x128px
- **설명**: 금, 은, 동 메달 등
- **포맷**: PNG

---

### 5. 플레이어 / 유저

#### `user-default-avatar.png`
- **용도**: 유저 프로필 기본 이미지
- **권장 크기**: 256x256px (정사각형)
- **설명**: 기본 프로필 사진
- **포맷**: PNG

---

### 6. 기타

#### `og-image.jpg`
- **용도**: Open Graph / 소셜 미디어 공유 이미지
- **권장 크기**: 1200x630px (OG 표준 비율)
- **설명**: 사이트 대표 이미지
- **포맷**: JPG

#### `favicon.ico` (루트에 위치)
- **용도**: 브라우저 파비콘
- **크기**: 32x32px, 16x16px (멀티 사이즈)
- **위치**: `/public/favicon.ico`

---

## 이미지 최적화 가이드

### 1. 파일 크기 최적화
- JPG: [TinyJPG](https://tinyjpg.com/) 사용
- PNG: [TinyPNG](https://tinypng.com/) 사용
- SVG: [SVGOMG](https://jakearchibald.github.io/svgomg/) 사용

### 2. 권장 포맷
- 사진/배경: **JPG** (용량 효율)
- 로고/아이콘: **PNG** (투명 배경) 또는 **SVG** (벡터)
- 애니메이션: **WebP** 또는 **AVIF** (차세대 포맷)

### 3. 반응형 이미지
Next.js Image 컴포넌트 사용 시 자동 최적화:

```tsx
import Image from 'next/image';

<Image
  src="/images/hero-background.jpg"
  alt="Hero Background"
  width={1920}
  height={1080}
  priority // 중요한 이미지는 우선 로드
  quality={85} // 품질 조정 (기본 75)
/>
```

### 4. 지연 로딩 (Lazy Loading)
중요하지 않은 이미지는 지연 로딩:

```tsx
<Image
  src="/images/post-thumbnail.jpg"
  alt="Post Thumbnail"
  width={1200}
  height={630}
  loading="lazy" // 스크롤 시 로드
/>
```

---

## 폴더 구조 (권장)

```
public/images/
├── hero/
│   ├── hero-background.jpg
│   └── hero-character.png
├── logos/
│   ├── logo.png
│   ├── logo-light.svg
│   └── logo-dark.svg
├── placeholders/
│   ├── post-placeholder.jpg
│   ├── clan-default-logo.png
│   └── user-default-avatar.png
├── badges/
│   ├── rank-1.png
│   ├── rank-2.png
│   └── rank-3.png
└── og-image.jpg
```

---

## 현재 사용 중인 이미지

### ✅ 외부 링크 사용 중
- Font Awesome 아이콘 (CDN)

### ⚠️ 추가 필요
- `hero-background.jpg` - 홈 페이지 배경 이미지
- 기타 이미지는 선택 사항

---

## 참고 사항

1. **이미지 파일명**: 소문자와 하이픈 사용 (예: `hero-background.jpg`)
2. **파일 크기**: 최대 500KB 이하 권장 (배경 이미지 제외)
3. **저작권**: 사용 권한이 있는 이미지만 추가
4. **접근성**: 모든 이미지에 `alt` 속성 필수

---

## 추가 예정

- 광고 배너 이미지
- 슬라이더 이미지
- 이벤트 배너
