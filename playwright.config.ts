import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* 병렬 실행 */
  fullyParallel: true,

  /* CI 환경에서만 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* CI에서는 병렬 처리 비활성화 */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter 설정 */
  reporter: 'html',

  /* 모든 테스트의 공통 설정 */
  use: {
    /* Base URL */
    baseURL: 'http://localhost:3000',

    /* 실패 시 스크린샷 수집 */
    screenshot: 'only-on-failure',

    /* 실패 시 비디오 수집 */
    video: 'retain-on-failure',

    /* 트레이스 수집 */
    trace: 'on-first-retry',
  },

  /* 테스트 전에 개발 서버 시작 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* 프로젝트 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Firefox와 Safari는 필요 시 주석 해제
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* 모바일 뷰포트 테스트 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],
});
