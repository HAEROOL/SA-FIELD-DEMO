import { test, expect } from '@playwright/test';

test.describe('메인 페이지 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('REQ-MAIN-001: 검색 입력', () => {
    test('검색어를 입력할 수 있어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 한글 입력
      await searchInput.fill('Ultron');
      await expect(searchInput).toHaveValue('Ultron');

      // 영어 입력
      await searchInput.fill('sa_king');
      await expect(searchInput).toHaveValue('sa_king');

      // 특수문자 입력
      await searchInput.fill('sa_king☆');
      await expect(searchInput).toHaveValue('sa_king☆');
    });

    test('검색어 입력 시 placeholder가 표시되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 클랜 선택 시
      await expect(searchInput).toHaveAttribute('placeholder', '리그 참여 클랜명 입력');

      // 플레이어 선택 시
      await page.getByRole('button', { name: '플레이어' }).click();
      await expect(searchInput).toHaveAttribute('placeholder', '플레이어 닉네임 입력 (예: sa_king☆)');
    });
  });

  test.describe('REQ-MAIN-002: 검색 분류', () => {
    test('클랜과 플레이어 검색 타입을 선택할 수 있어야 한다', async ({ page }) => {
      const clanButton = page.getByRole('button', { name: '클랜' });
      const playerButton = page.getByRole('button', { name: '플레이어' });

      // 기본적으로 클랜이 선택되어 있어야 함
      await expect(clanButton).toHaveClass(/bg-brand-600/);

      // 플레이어 선택
      await playerButton.click();
      await expect(playerButton).toHaveClass(/bg-brand-600/);
      await expect(clanButton).not.toHaveClass(/bg-brand-600/);

      // 다시 클랜 선택
      await clanButton.click();
      await expect(clanButton).toHaveClass(/bg-brand-600/);
      await expect(playerButton).not.toHaveClass(/bg-brand-600/);
    });

    test('검색 타입 변경 시 검색어가 초기화되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 클랜에서 검색어 입력
      await searchInput.fill('Ultron');
      await expect(searchInput).toHaveValue('Ultron');

      // 플레이어로 변경
      await page.getByRole('button', { name: '플레이어' }).click();
      await expect(searchInput).toHaveValue('');
    });
  });

  test.describe('REQ-MAIN-003: 검색 실행', () => {
    test('검색 버튼 클릭 시 검색이 실행되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');
      const searchButton = page.locator('button:has(i.fa-search)');

      // 검색어 입력
      await searchInput.fill('Ultron');

      // 검색 버튼 클릭 시 alert 확인
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Ultron');
        expect(dialog.message()).toContain('clan');
        await dialog.accept();
      });

      await searchButton.click();
    });

    test('Enter 키 입력 시 검색이 실행되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 검색어 입력
      await searchInput.fill('Ultron');

      // Enter 키 입력 시 alert 확인
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Ultron');
        await dialog.accept();
      });

      await searchInput.press('Enter');
    });

    test('검색어가 비어있을 때 경고 메시지가 표시되어야 한다', async ({ page }) => {
      const searchButton = page.locator('button:has(i.fa-search)');

      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('검색어를 입력해주세요.');
        await dialog.accept();
      });

      await searchButton.click();
    });
  });

  test.describe('REQ-MAIN-004: 검색 미리보기', () => {
    test('검색어 입력 시 자동완성 결과가 표시되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 검색어 입력
      await searchInput.fill('Ul');

      // 미리보기 드롭다운이 표시되어야 함
      const preview = page.locator('ul');
      await expect(preview).toBeVisible();

      // Ultron 결과가 포함되어야 함
      await expect(page.getByText('Ultron')).toBeVisible();
    });

    test('미리보기에서 항목 클릭 시 검색어가 설정되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 검색어 입력하여 미리보기 표시
      await searchInput.fill('Ul');

      // alert 핸들러 설정
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Ultron');
        await dialog.accept();
      });

      // Ultron 항목 클릭
      await page.getByText('Ultron').first().click();
    });

    test('외부 클릭 시 미리보기가 닫혀야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 검색어 입력하여 미리보기 표시
      await searchInput.fill('Ul');

      // 미리보기가 표시되는지 확인
      const preview = page.locator('ul');
      await expect(preview).toBeVisible();

      // 외부 클릭
      await page.locator('body').click({ position: { x: 0, y: 0 } });

      // 미리보기가 사라져야 함
      await expect(preview).not.toBeVisible();
    });

    test('검색 타입에 맞는 결과가 표시되어야 한다', async ({ page }) => {
      const searchInput = page.locator('input[type="text"]');

      // 클랜 검색
      await searchInput.fill('Ul');
      await expect(page.getByText('Ultron')).toBeVisible();
      await expect(page.locator('i.fa-shield-alt')).toBeVisible();

      // 플레이어로 변경
      await page.getByRole('button', { name: '플레이어' }).click();
      await searchInput.fill('sa');

      // 플레이어 아이콘이 표시되어야 함
      await expect(page.locator('i.fa-user')).toBeVisible();
    });
  });

  test.describe('REQ-MAIN-005: 실시간 인기글', () => {
    test('인기 게시글 목록이 표시되어야 한다', async ({ page }) => {
      // "인기 게시글" 헤더 확인
      await expect(page.getByRole('heading', { name: /인기 게시글/i })).toBeVisible();

      // 게시글 카드가 표시되어야 함
      const posts = page.locator('.bg-white.dark\\:bg-brand-800').filter({ hasText: '경기분석' });
      await expect(posts).toBeVisible();
    });

    test('게시글에 필수 정보가 표시되어야 한다', async ({ page }) => {
      // 첫 번째 게시글 확인
      const firstPost = page.locator('.bg-white.dark\\:bg-brand-800').first();

      // 카테고리
      await expect(firstPost.getByText('경기분석')).toBeVisible();

      // 제목
      await expect(firstPost.getByText(/Ultron 스나이퍼/)).toBeVisible();

      // 작성자
      await expect(firstPost.locator('i.fa-user')).toBeVisible();

      // 작성 시간
      await expect(firstPost.locator('i.fa-clock')).toBeVisible();

      // 추천 수
      await expect(firstPost.getByText('추천')).toBeVisible();
    });
  });

  test.describe('REQ-MAIN-006: 실시간 인기글 이동', () => {
    test('게시글 클릭 시 호버 효과가 적용되어야 한다', async ({ page }) => {
      const firstPost = page.locator('.bg-white.dark\\:bg-brand-800').first();

      // 호버 시 border 색상이 변경되어야 함
      await firstPost.hover();
      await expect(firstPost).toHaveClass(/hover:border-brand-500/);
    });

    test('게시글에 cursor-pointer 클래스가 있어야 한다', async ({ page }) => {
      const firstPost = page.locator('.bg-white.dark\\:bg-brand-800').first();
      await expect(firstPost).toHaveClass(/cursor-pointer/);
    });
  });

  test.describe('REQ-MAIN-007: 라이브 매치 및 광고', () => {
    test('광고 슬라이더가 표시되어야 한다', async ({ page }) => {
      // 슬라이더 컨테이너 확인
      const slider = page.locator('.flex.overflow-x-auto');
      await expect(slider).toBeVisible();

      // 광고 카드 확인
      await expect(page.getByText('전적 즉시 갱신권')).toBeVisible();
      await expect(page.getByText('닉네임 변경 50% 할인')).toBeVisible();
    });

    test('광고 카드에 호버 효과가 있어야 한다', async ({ page }) => {
      const firstAd = page.locator('.snap-center').first();
      await expect(firstAd).toHaveClass(/hover:border-brand-500/);
    });
  });

  test.describe('REQ-MAIN-008: 페이지 이동', () => {
    test('리그 랭킹 전체보기 링크가 있어야 한다', async ({ page }) => {
      const viewAllLink = page.getByRole('link', { name: '전체보기' });
      await expect(viewAllLink).toBeVisible();
    });

    test('클랜 랭킹이 표시되어야 한다', async ({ page }) => {
      // 랭킹 테이블 확인
      await expect(page.getByRole('heading', { name: /리그 클랜 랭킹/i })).toBeVisible();

      // 1위 클랜 확인
      await expect(page.getByText('Ultron')).toBeVisible();
      await expect(page.getByText('1,250')).toBeVisible();
    });
  });

  test.describe('반응형 디자인', () => {
    test('모바일 화면에서 레이아웃이 적절히 표시되어야 한다', async ({ page }) => {
      // 모바일 화면 크기로 변경
      await page.setViewportSize({ width: 375, height: 667 });

      // 검색 섹션이 표시되어야 함
      const searchInput = page.locator('input[type="text"]');
      await expect(searchInput).toBeVisible();

      // 인기 게시글이 표시되어야 함
      await expect(page.getByRole('heading', { name: /인기 게시글/i })).toBeVisible();
    });

    test('태블릿 화면에서 레이아웃이 적절히 표시되어야 한다', async ({ page }) => {
      // 태블릿 화면 크기로 변경
      await page.setViewportSize({ width: 768, height: 1024 });

      // 모든 주요 섹션이 표시되어야 함
      await expect(page.locator('input[type="text"]')).toBeVisible();
      await expect(page.getByRole('heading', { name: /인기 게시글/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /리그 클랜 랭킹/i })).toBeVisible();
    });

    test('데스크톱 화면에서 레이아웃이 적절히 표시되어야 한다', async ({ page }) => {
      // 데스크톱 화면 크기로 변경
      await page.setViewportSize({ width: 1920, height: 1080 });

      // 모든 섹션이 표시되어야 함
      await expect(page.locator('input[type="text"]')).toBeVisible();
      await expect(page.getByRole('heading', { name: /인기 게시글/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /리그 클랜 랭킹/i })).toBeVisible();
    });
  });

});
