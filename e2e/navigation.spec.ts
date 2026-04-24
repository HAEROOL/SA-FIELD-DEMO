import { test, expect } from '@playwright/test';

test.describe('네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('리그 메뉴 클릭 시 클랜 랭킹 페이지로 이동해야 한다', async ({ page }) => {
    // 리그 메뉴 찾기
    const leagueLink = page.getByRole('link', { name: /리그/i });
    await expect(leagueLink).toBeVisible();

    // 리그 메뉴 클릭
    await leagueLink.click();

    // 클랜 랭킹 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/league/);
    
    // 기본적으로 1부 리그가 선택되어야 함
    await expect(page).toHaveURL(/division=1/);

    // 리그 헤더 확인
    await expect(page.getByText('OFFICIAL LEAGUE')).toBeVisible();
  });

  test('개인 랭킹 메뉴 클릭 시 개인 랭킹 페이지로 이동해야 한다', async ({ page }) => {
    // 개인 랭킹 메뉴 찾기
    const rankingLink = page.getByRole('link', { name: /개인 랭킹/i });
    await expect(rankingLink).toBeVisible();

    // 개인 랭킹 메뉴 클릭
    await rankingLink.click();

    // 개인 랭킹 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/ranking/);

    // 개인 랭킹 헤더 확인
    await expect(page.getByText(/개인 랭킹|PERSONAL RANKING/i)).toBeVisible();
  });

  test('모바일 메뉴에서도 네비게이션이 작동해야 한다', async ({ page }) => {
    // 모바일 화면 크기로 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 모바일 메뉴 버튼 찾기
    const mobileMenuButton = page.locator('button').filter({ has: page.locator('i.fa-bars') });
    
    if (await mobileMenuButton.isVisible()) {
      // 모바일 메뉴 열기
      await mobileMenuButton.click();

      // 리그 메뉴 클릭
      const leagueLink = page.getByRole('link', { name: /리그/i });
      await leagueLink.click();

      // 클랜 랭킹 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/league/);
    }
  });

  test('네비게이션 바가 모든 페이지에서 표시되어야 한다', async ({ page }) => {
    // 홈 페이지에서 네비게이션 확인
    await expect(page.getByText('SA.FIELD')).toBeVisible();

    // 리그 페이지로 이동
    await page.goto('/league');
    await expect(page.getByText('SA.FIELD')).toBeVisible();

    // 개인 랭킹 페이지로 이동
    await page.goto('/ranking');
    await expect(page.getByText('SA.FIELD')).toBeVisible();
  });
});
