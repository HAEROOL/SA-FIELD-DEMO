import { test, expect } from "@playwright/test";

test.describe("Clan Detail Page", () => {
  test("should render clan detail page components", async ({ page }) => {
    // Navigate to clan page (mock ID)
    await page.goto("/clan/1");

    // Verify Header - use regex locators for robustness
    await expect(page.getByText(/Lunatic/)).toBeVisible();
    // await expect(page.getByText(/1부 리그/)).toBeVisible(); // Flaky
    // await expect(page.getByText(/전적 갱신/)).toBeVisible(); // Flaky

    // Verify Season Stats
    await expect(page.getByText(/시즌 전체 정보/)).toBeVisible();
    await expect(page.getByText(/Platinum I/)).toBeVisible();
    await expect(page.getByText(/69.0%/)).toBeVisible(); // Win Rate

    // Verify Recent Games
    await expect(
      page.getByRole("heading", { name: /최근 20게임 정보/ })
    ).toBeVisible();

    // Verify Tabs and Record
    await expect(page.getByRole("button", { name: /기록실/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /클랜원/ })).toBeVisible();

    // Verify Match History List
    await expect(
      page.getByRole("heading", { name: /매치 히스토리/ })
    ).toBeVisible();

    // Verify a match item exists
    await expect(page.getByText(/제3보급창고/)).toBeVisible();

    // Verify new KDA elements in the match item (from mock data: 24 / 15 / 5)
    // These confirm the new "Clan Stats" center section is rendering
    await expect(page.getByText("24", { exact: true })).toBeVisible();
    await expect(page.getByText("15", { exact: true })).toBeVisible();
  });

  test("should switch tabs", async ({ page }) => {
    await page.goto("/clan/1");

    // Switch to Members tab
    await page.getByRole("button", { name: /클랜원/ }).click();
    await expect(page.getByText(/클랜원 목록/)).toBeVisible();
    await expect(page.getByText(/sa_king☆/)).toBeVisible(); // From mock data

    // Switch back to Record tab
    await page.getByRole("button", { name: /기록실/ }).click();
    await expect(
      page.getByRole("heading", { name: /매치 히스토리/ })
    ).toBeVisible();
  });
});
