import { test, expect } from '@playwright/test';

test.describe('개인 랭킹 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ranking');
  });

  test('개인 랭킹 페이지가 정상적으로 로드되어야 한다', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/SA.FIELD/i);

    // 개인 랭킹 헤더 확인
    await expect(page.getByText(/개인 랭킹|PERSONAL RANKING/i)).toBeVisible();
  });

  test('개인 랭킹 테이블이 올바르게 표시되어야 한다', async ({ page }) => {
    // 테이블 헤더 확인
    await expect(page.getByRole('columnheader', { name: /Rank/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Score/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Record/i })).toBeVisible();

    // K/D 헤더가 표시되는지 확인 (개인 랭킹 특징)
    await expect(page.getByRole('columnheader', { name: /K\/D/i })).toBeVisible();

    // 플레이어 데이터가 표시되는지 확인 (최소 1개 이상)
    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('더보기 버튼이 작동해야 한다', async ({ page }) => {
    // 더보기 버튼 찾기
    const loadMoreButton = page.getByRole('button', { name: /더보기/i });

    // 더보기 버튼이 있다면 클릭
    if (await loadMoreButton.isVisible()) {
      // 현재 행 개수 확인
      const initialRowCount = await page.locator('tbody tr').count();

      // 더보기 클릭
      await loadMoreButton.click();

      // 로딩 완료 대기
      await page.waitForTimeout(1000);

      // 행 개수가 증가했는지 확인
      const newRowCount = await page.locator('tbody tr').count();
      expect(newRowCount).toBeGreaterThan(initialRowCount);
    }
  });

  test('플레이어명 클릭 시 플레이어 상세 페이지로 이동해야 한다', async ({ page }) => {
    // 첫 번째 플레이어 링크 찾기
    const firstPlayerLink = page.locator('tbody tr').first().locator('a').first();

    if (await firstPlayerLink.isVisible()) {
      await firstPlayerLink.click();

      // 플레이어 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/user\/.+/);
    }
  });

  test('다크모드에서도 정상적으로 표시되어야 한다', async ({ page }) => {
    // 다크모드 토글 찾기
    const darkModeToggle = page.locator('button').filter({ has: page.locator('i.fa-moon, i.fa-sun') }).first();

    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      
      // 잠시 대기
      await page.waitForTimeout(300);
    }

    // 개인 랭킹 헤더가 여전히 보이는지 확인
    await expect(page.getByText(/개인 랭킹|PERSONAL RANKING/i)).toBeVisible();
  });
});
