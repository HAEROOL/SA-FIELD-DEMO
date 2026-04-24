import { test, expect } from '@playwright/test';

test.describe('클랜 랭킹 페이지 (리그)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/league');
  });

  test('클랜 랭킹 페이지가 정상적으로 로드되어야 한다', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/SA.FIELD/i);

    // 리그 헤더 확인
    await expect(page.getByText('OFFICIAL LEAGUE')).toBeVisible();
  });

  test('리그 부 선택 탭이 작동해야 한다', async ({ page }) => {
    // 1부 리그 탭 확인
    const div1Tab = page.getByRole('button', { name: /1부/i });
    await expect(div1Tab).toBeVisible();

    // 2부 리그 선택
    const div2Tab = page.getByRole('button', { name: /2부/i });
    await div2Tab.click();

    // URL에 division=2가 포함되어야 함
    await expect(page).toHaveURL(/division=2/);

    // 3부 리그 선택
    const div3Tab = page.getByRole('button', { name: /3부/i });
    await div3Tab.click();

    // URL에 division=3이 포함되어야 함
    await expect(page).toHaveURL(/division=3/);
  });

  test('클랜 랭킹 테이블이 올바르게 표시되어야 한다', async ({ page }) => {
    // 테이블 헤더 확인
    await expect(page.getByRole('columnheader', { name: /Rank/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Name/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Score/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Record/i })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Win Rate/i })).toBeVisible();

    // 클랜 데이터가 표시되는지 확인 (최소 1개 이상)
    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('클랜명 클릭 시 클랜 상세 페이지로 이동해야 한다', async ({ page }) => {
    // 첫 번째 클랜 링크 찾기
    const firstClanLink = page.locator('tbody tr').first().locator('a').first();

    if (await firstClanLink.isVisible()) {
      await firstClanLink.click();

      // 클랜 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/clan\/.+/);
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

    // 리그 헤더가 여전히 보이는지 확인
    await expect(page.getByText('OFFICIAL LEAGUE')).toBeVisible();
  });
});
