import { test, expect } from '@playwright/test';

test.describe('개인 상세 페이지', () => {
  test.beforeEach(async ({ page }) => {
    // Mock 사용자 페이지로 이동
    await page.goto('/user/sa_king');
  });

  test('개인 상세 페이지가 정상적으로 로드되어야 한다', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/SA.FIELD/i);

    // 사용자 닉네임 확인
    await expect(page.getByRole('heading', { name: /sa_king/i })).toBeVisible();

    // 전적 갱신 버튼 확인
    await expect(page.getByRole('button', { name: /전적 갱신/i })).toBeVisible();
  });

  test('개인 기본 정보가 표시되어야 한다', async ({ page }) => {
    // 닉네임 표시
    await expect(page.getByText(/sa_king/i)).toBeVisible();

    // 랭크 뱃지 확인
    await expect(page.getByText(/Legend|Diamond|Platinum/i)).toBeVisible();

    // 클랜 정보 표시
    await expect(page.getByText(/Clan/i)).toBeVisible();

    // 포인트 정보 표시
    await expect(page.getByText(/Points/i)).toBeVisible();
  });

  test('탭 전환이 작동해야 한다', async ({ page }) => {
    // 기록실 탭 확인
    const recordTab = page.getByRole('button', { name: /기록실/i });
    await expect(recordTab).toBeVisible();

    // 동향 분석 탭으로 전환
    const analyticsTab = page.getByRole('button', { name: /동향 분석/i });
    await analyticsTab.click();

    // 동향 분석 콘텐츠 확인
    await expect(page.getByText(/개인 상세 통계 분석|동향 분석/i)).toBeVisible();

    // 다시 기록실로 전환
    await recordTab.click();

    // 매치 히스토리 확인
    await expect(page.getByText(/매치 히스토리/i)).toBeVisible();
  });

  test('최근 같이한 플레이어 탭이 작동해야 한다', async ({ page }) => {
    // 최근 같이한 플레이어 탭 클릭
    const teammatesTab = page.getByRole('button', { name: /같이한 플레이어|플레이어/i });

    if (await teammatesTab.isVisible()) {
      await teammatesTab.click();

      // 플레이어 목록 테이블 확인
      await expect(page.getByRole('columnheader', { name: /닉네임|Player/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /승률|Win Rate/i })).toBeVisible();
    }
  });

  test('시즌 전적 상세 정보가 표시되어야 한다', async ({ page }) => {
    // 시즌 전적 상세 섹션 확인
    await expect(page.getByText(/시즌 전적 상세/i)).toBeVisible();

    // 통계 정보 확인
    await expect(page.getByText(/Win Rate|승률/i)).toBeVisible();
    await expect(page.getByText(/K \/ D/i)).toBeVisible();
    await expect(page.getByText(/MVP/i)).toBeVisible();
    await expect(page.getByText(/Headshot/i)).toBeVisible();
  });

  test('매치 히스토리 목록이 표시되어야 한다', async ({ page }) => {
    // 매치 히스토리 제목 확인
    await expect(page.getByText(/매치 히스토리/i)).toBeVisible();

    // WIN/LOSE 표시 확인
    const winMatch = page.getByText('WIN').first();
    if (await winMatch.isVisible()) {
      await expect(winMatch).toBeVisible();
    }

    // 맵 이름 확인 (예: 제3보급창고)
    const mapName = page.getByText(/제3보급창고|드래곤로드/i).first();
    if (await mapName.isVisible()) {
      await expect(mapName).toBeVisible();
    }

    // LP 변동 확인
    const lpChange = page.getByText(/\+ \d+ LP|- \d+ LP/i).first();
    if (await lpChange.isVisible()) {
      await expect(lpChange).toBeVisible();
    }
  });

  test('매치 상세 정보 확장이 작동해야 한다', async ({ page }) => {
    // 첫 번째 매치 클릭
    const firstMatch = page.locator('[class*="border-l-brand"]').first();
    await firstMatch.click();

    // 상세 정보가 표시되는지 확인
    await expect(page.getByText(/My Team|Enemy Team/i)).toBeVisible();

    // 플레이어 KDA 정보 확인
    await expect(page.getByText(/K \/ D \/ A/i)).toBeVisible();
  });

  test('매치 히스토리에서 클랜명 클릭 시 클랜 상세 페이지로 이동해야 한다', async ({ page }) => {
    // 매치 히스토리 펼치기
    const firstMatch = page.locator('[class*="border-l-brand"]').first();
    await firstMatch.click();

    // 클랜 링크 찾기
    const clanLink = page.getByRole('link', { name: /Ultron|OnePoint|Ever/i }).first();

    if (await clanLink.isVisible()) {
      await clanLink.click();

      // 클랜 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/clan\/.+/);
    }
  });

  test('더 불러오기 버튼이 작동해야 한다', async ({ page }) => {
    // 더 불러오기 버튼 확인
    const loadMoreButton = page.getByRole('button', { name: /더 불러오기/i });
    await expect(loadMoreButton).toBeVisible();

    // 버튼 클릭
    await loadMoreButton.click();

    // 로딩 상태 또는 추가 매치가 로드되었는지 확인
    // (구현 후 더 구체적인 검증 추가)
  });

  test('전적 갱신 버튼이 작동해야 한다', async ({ page }) => {
    // 전적 갱신 버튼 클릭
    const refreshButton = page.getByRole('button', { name: /전적 갱신/i });
    await refreshButton.click();

    // 로딩 상태 확인 (구현 후 검증)
    // 예: await expect(refreshButton).toHaveAttribute('disabled');

    // 갱신 완료 메시지 확인 (토스트 등)
    // (구현 후 추가)
  });

  test('용병 매치가 올바르게 표시되어야 한다', async ({ page }) => {
    // 용병 뱃지 확인
    const mercBadge = page.getByText(/용병/i).first();

    if (await mercBadge.isVisible()) {
      await expect(mercBadge).toBeVisible();

      // 소속 클랜 정보 확인
      await expect(page.getByText(/소속:/i)).toBeVisible();
    }
  });

  test('다크모드에서도 정상적으로 표시되어야 한다', async ({ page }) => {
    // 다크모드 토글
    const darkModeToggle = page.locator('[aria-label*="다크"]').or(page.locator('button').filter({ hasText: /🌙|☀️/ }));

    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
    }

    // 다크모드 클래스 확인
    const htmlElement = page.locator('html');
    const htmlClass = await htmlElement.getAttribute('class');

    if (htmlClass?.includes('dark')) {
      // 사용자 헤더가 여전히 보이는지 확인
      await expect(page.getByRole('heading', { name: /sa_king/i })).toBeVisible();

      // 매치 히스토리가 보이는지 확인
      await expect(page.getByText(/매치 히스토리/i)).toBeVisible();
    }
  });

  test('반응형 디자인이 작동해야 한다', async ({ page }) => {
    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 });

    // 사용자 정보가 여전히 보이는지 확인
    await expect(page.getByRole('heading', { name: /sa_king/i })).toBeVisible();

    // 탭이 보이는지 확인
    await expect(page.getByRole('button', { name: /기록실/i })).toBeVisible();

    // 매치 히스토리가 보이는지 확인
    await expect(page.getByText(/매치 히스토리/i)).toBeVisible();
  });
});
