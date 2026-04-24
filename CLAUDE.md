# CLAUDE.md - SA.FIELD 개발자 가이드
---

## 프로젝트 개요

**SA.FIELD**는 Next.js 16, React 19, TypeScript, Tailwind CSS v4로 구축된 서든어택 클랜 배틀 커뮤니티 및 전적 검색 서비스입니다. 클랜 리그 추적, 플레이어 통계, 커뮤니티 토론을 위한 게임 플랫폼입니다.



## 🚀 빠른 명령어
- **개발**: `npm run dev` (localhost:3000)
- **빌드**: `npm run build` | **실행**: `npm start`
- **린트**: `npm run lint`
- **단위 테스트**: `npm test` (watch) | `npm test -- --run` (CI)
- **E2E 테스트**: `npm run test:e2e` | `npm run test:e2e:ui` (디버그)

## 🏗 아키텍처 및 기술 스택
- **코어**: Next.js 16 (App Router), React 19, TS, Tailwind v4.
- **상태 관리**: TanStack Query v5 (Server), React State (Local).
- **데이터 흐름**: `src/apis/{service}.ts` -> `src/hooks/` -> 컴포넌트.
- **실시간**: SSE(`useSSERefresh`)를 통한 유저 전적 실시간 갱신.
- **에디터**: 게시글 작성을 위한 Tiptap 리치 텍스트 에디터.

## 📏 개발 규칙 및 패턴
- **TDD 우선순위**: E2E (Playwright) > 통합 (RTL) > 단위 (Vitest).
- **네이밍 규칙**: 
  - 컴포넌트: PascalCase (`ClanHeader.tsx`).
  - API/훅: camelCase (`postService.ts`, `usePosts.ts`).
  - 타입: `{domain}.type.ts`.
- **문서 동기화(필수)**: 모든 작업(기능 구현, 버그 수정, 리팩토링)이 끝날 때마다 반드시 `docs/` 내 연관된 하위 문서를 최신 상태로 업데이트한다.

## 🧪 테스팅 전략
**중요**: `.claude/skills/e2e-testing.md` 및 `docs/testing-strategy.md` 지침을 엄격히 준수한다.
- **E2E**: Playwright 네이티브 `page.route()`만 사용 (MSW 미사용). 페이지별 검증 그룹화.
- **단위**: `utils/` 및 순수 UI 로직 중심.

## 📂 상세 가이드 링크
- [디자인 시스템 & 스타일](./docs/design-system.md): 상세 색상, 타이포그래피, 반응형 규칙
- [구조 및 데이터 흐름](./docs/architecture.md): 폴더 구조, API 패턴, 사용 라이브러리
- [테스팅 전략](./docs/testing-strategy.md): Playwright 네이티브 모킹, RTL 패턴, 커버리지 목표