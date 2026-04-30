# SA.FIELD Demo

> ⚠️ **이 저장소는 데모(Demo) 환경입니다.**
> 실제 서비스 백엔드(`api.safield.kr`)에 연결되지 않으며, Next.js 단독 실행만으로 모든 UX를 시연할 수 있도록 인메모리 모킹된 데모 빌드입니다.

**🔗 라이브 데모: [sa-field-demo.vercel.app](https://sa-field-demo.vercel.app)**

---

## 프로젝트 소개

**SA.FIELD** 는 서든어택 클랜 배틀 커뮤니티 및 전적 검색 서비스입니다. 클랜 리그 추적, 플레이어 통계, 커뮤니티 토론 기능을 갖춘 게임 플랫폼이며, 본 데모는 동일한 UI/UX 와 기능 흐름을 외부 의존 없이 체험할 수 있도록 구성되어 있습니다.

### 데모 환경의 특징
- 외부 API 서버 없이 Next.js App Router route handler 와 인메모리 `DemoStore` 만으로 동작합니다.
- 모든 페이지 상단에 **데모 환경 안내 배너**가 노출됩니다.
- 광고 영역(상/하단, 좌/우 사이드)은 데모 환경에서 의도적으로 비활성화되어 있습니다.
- 게시글 작성·수정·삭제, 투표, 댓글, SSE 전적 갱신 등 핵심 시나리오를 자유롭게 체험할 수 있습니다.
- 게시글 수정/삭제 기본 비밀번호는 `demo1234` 입니다.

> 데모 모드의 동작 원리, fixture 구성, API 라우트 목록은 [`docs/demo-mode.md`](./docs/demo-mode.md) 를 참고하세요.

---

## 기술 스택

- **프레임워크**: Next.js 16 (App Router), React 19, TypeScript
- **스타일**: Tailwind CSS v4
- **상태 관리**: TanStack Query v5 (Server State)
- **폼 / 검증**: React Hook Form + Zod
- **에디터**: Tiptap (이미지·링크·텍스트 정렬·밑줄 익스텐션 포함)
- **실시간**: SSE 기반 전적 갱신 (`useSSERefresh`)
- **테스트**: Vitest + Testing Library, Playwright (E2E)

---

## 시작하기

### 요구 사항
- Node.js 20+
- npm 10+

### 설치 및 실행
```bash
npm install
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 주요 스크립트
| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 (`localhost:3000`) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm test` | Vitest 단위 테스트 (watch) |
| `npm test -- --run` | Vitest 단일 실행 (CI) |
| `npm run test:e2e` | Playwright E2E 테스트 |
| `npm run test:e2e:ui` | Playwright UI 모드 |

---

## 프로젝트 구조

```
src/
├── app/              # App Router 페이지
│   └── api/          # 데모 전용 인메모리 route handler
├── components/       # 도메인별 컴포넌트 (layout, ui, home, board, league, clan, user)
├── apis/             # API 서비스 계층 (axios instance + 도메인별 서비스)
├── hooks/            # TanStack Query queries / mutations / 유틸 훅
└── mocks/            # 데모 fixture (seed) + 인메모리 store
```

상세 구조와 데이터 흐름은 [`docs/architecture.md`](./docs/architecture.md) 를 참고하세요.

---

## 실서비스 백엔드로 전환

`.env` 의 두 환경 변수만 변경하면 실제 백엔드와 연결됩니다.

```env
NEXT_PUBLIC_API_URL=https://api.safield.kr/api/
NEXT_PUBLIC_REFRESH_URL=https://api.safield.kr/
```

`src/app/api/**` 의 데모 route handler 는 그대로 두어도 사용되지 않지만, 실서비스 배포 시에는 해당 디렉토리를 제거하거나 조건부로 비활성화하는 것을 권장합니다.