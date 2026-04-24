# 시스템 아키텍처 및 라이브러리

## 📂 폴더 구조
- `src/app/`: App Router 기반 페이지 구성
- `src/components/`: 도메인별 분리 (layout, ui, home, board, league, clan, user)
- `src/apis/`: 서비스 계층 (`instance.ts` 및 도메인별 서비스)
- `src/hooks/`: `queries/`, `mutations/` 및 유틸리티 훅

## 🔄 데이터 통신 패턴
- **Pattern**: API Service -> Custom Hook (TanStack Query) -> Component
- **Error**: `instance.ts` 인터셉터 전역 처리 및 Query `onError` 개별 처리

## 🛠 주요 라이브러리 기능
- **Tiptap**: 이미지, 링크, 플레이스홀더, 텍스트 정렬, 밑줄 익스텐션 포함
- **SSE**: `NEXT_PUBLIC_REFRESH_URL`을 통한 실시간 전적 갱신 추적
- **Forms**: React Hook Form + Zod (스키마 검증)