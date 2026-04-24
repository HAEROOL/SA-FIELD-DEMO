# 1. Base 설정: 모든 단계의 기초가 되는 이미지
FROM node:20-alpine AS base

# 2. Dependencies 단계: 의존성 설치 (캐싱 활용)
FROM base AS deps
# alpine 이미지에서 일부 패키지 빌드 시 필요한 라이브러리 추가
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 패키지 매니저 확인 및 설치
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi


# 3. Builder 단계: 소스 코드 빌드
FROM base AS builder
WORKDIR /app
# 이전 단계에서 설치된 node_modules 가져오기
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 시점에 필요한 환경변수 주입
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_REFRESH_URL
ENV NEXT_PUBLIC_REFRESH_URL=${NEXT_PUBLIC_REFRESH_URL}

# Next.js 빌드 실행
RUN \
    if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi


# 4. Runner 단계: 실제 실행용 경량 이미지
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안을 위해 비루트(non-root) 사용자 설정
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 빌드 결과물(standalone) 및 정적 파일 복사
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 빌드된 Next.js 앱 실행
CMD ["node", "server.js"]