# 시스템 아키텍처 및 라이브러리

## 📂 폴더 구조
- `src/app/`: App Router 기반 페이지 구성
- `src/app/api/`: **데모 모드 전용** 인메모리 route handler (백엔드 독립 실행)
- `src/components/`: 도메인별 분리 (layout, ui, home, board, league, clan, user)
- `src/apis/`: 서비스 계층 (`instance.ts` 및 도메인별 서비스)
- `src/hooks/`: `queries/`, `mutations/` 및 유틸리티 훅
- `src/mocks/`: 데모 모드 fixture (seed) + 인메모리 store

## 🔄 데이터 통신 패턴
- **Pattern**: API Service -> Custom Hook (TanStack Query) -> Component
- **Error**: `instance.ts` 인터셉터 전역 처리 및 Query `onError` 개별 처리
- **데모 모드**: `.env`의 `NEXT_PUBLIC_API_URL=/api/`, `NEXT_PUBLIC_REFRESH_URL=/api` 상태에서는 모든 요청이 Next.js route handler(`src/app/api/**`)와 `src/mocks/store.ts` 인메모리 저장소로 처리됨. 상세는 [데모 모드 가이드](./demo-mode.md) 참조.

## 🛠 주요 라이브러리 기능
- **Tiptap**: 이미지, 링크, 플레이스홀더, 텍스트 정렬, 밑줄 익스텐션 포함
- **SSE**: `NEXT_PUBLIC_REFRESH_URL`을 통한 실시간 전적 갱신 추적
- **Forms**: React Hook Form + Zod (스키마 검증)