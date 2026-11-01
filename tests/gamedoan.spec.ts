import { test, expect } from '@playwright/test';

test('GameDoAn is reachable from LifeLab and preserves lessons, bookmarks and the game', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/skills');
  await page.getByRole('button', { name: 'Nhà an toàn · GameDoAn', exact: true }).click();
  await expect(page).toHaveURL(/\/gamedoan$/);
  await expect(page.getByText('Học và chơi', { exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/preview/gamedoan-screens.png' });
  await page.getByRole('button', { name: 'Mở Thư viện GameDoAn', exact: true }).click();
  const game = page.frameLocator('iframe[title="GameDoAn · Nhà an toàn"]');
  await expect(game.locator('#learning-app')).toHaveAttribute('data-screen', 'library');
  await game.locator('[data-route="safety"]').first().click();
  await game.locator('.learn-skill[data-route="fire"]').click();
  await game.getByRole('button', { name: 'Lưu kỹ năng', exact: true }).click();
  await game.locator('[data-action="start-lesson"]').click();
  for (let lesson = 1; lesson <= 2; lesson++) {
    await expect(game.locator('#learning-app')).toHaveAttribute('data-screen', 'reading');
    for (let card = 0; card < 3; card++) await game.locator('[data-action="reading-next"]').click();
    await expect(game.locator(`.learn-lesson-row[data-lesson="${lesson}"]`)).toHaveClass(/done/);
    await game.locator('[data-action="start-lesson"]').click();
  }
  await expect(game.locator('#learning-app')).toHaveAttribute('data-screen', 'briefing');
  await game.locator('[data-action="play-game"]').click();
  await expect(game.locator('#game-screen')).toBeVisible();
  await expect(game.locator('#kitchen')).toBeVisible();
  await expect(page).toHaveURL(/view=play/);
  await page.screenshot({ path: 'docs/preview/gamedoan-game.png' });
  await page.getByRole('button', { name: 'Về danh mục GameDoAn', exact: true }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Kỹ năng đã lưu', exact: true }).click();
  await expect(game.locator('.learn-skill[data-route="fire"]')).toBeVisible();
  await page.reload();
  await expect(game.locator('.learn-skill[data-route="fire"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('original quiz, results and review work inside the imported module', async ({ page }) => {
  await page.goto('/games/gamedoan/index.html');
  await page.evaluate(() =>
    localStorage.setItem('safe-kitchen-course-v1', JSON.stringify({ completed: [1, 2, 3] })),
  );
  await page.goto('/gamedoan/play?view=quiz');
  const game = page.frameLocator('iframe[title="GameDoAn · Nhà an toàn"]');
  for (const answer of [0, 1, 1, 0, 1]) {
    await game.locator(`[data-answer="${answer}"]`).click();
    await expect(game.locator('.learn-feedback')).toBeVisible();
    await game.locator('[data-action="quiz-next"]').click();
  }
  await expect(game.locator('.learn-score')).toHaveText('100');
  await expect(page).toHaveURL(/view=results/);
  await game.locator('[data-action="result-review"]').click();
  await expect(game.locator('.learn-review-card')).toHaveCount(5);
  await game.locator('[data-action="back-results"]').click();
  await game.locator('[data-action="result-replay"]').click();
  for (const answer of [0, 1, 1, 0, 1]) {
    await game.locator(`[data-answer="${answer}"]`).click();
    await game.locator('[data-action="quiz-next"]').click();
  }
  await expect(game.locator('.learn-reward').first()).toContainText('+0 EXP');
});

test('imported screens fit small phones and keep their local assets', async ({ page, request }) => {
  for (const size of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/gamedoan/play?view=fire');
    const game = page.frameLocator('iframe[title="GameDoAn · Nhà an toàn"]');
    await expect(game.locator('#learning-app')).toHaveAttribute('data-screen', 'fire');
    const bounds = await game.locator('.learn-actions').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height + 1);
    expect(
      await game.locator('html').evaluate((element) => element.scrollWidth <= innerWidth),
    ).toBe(true);
  }
  for (const asset of [
    'assets/visual/final.png',
    'assets/design-system/capriola.ttf',
    'assets/audio/pop.mp3',
    'assets/audio/voice/wire-0.mp3',
  ]) {
    const response = await request.get(`/games/gamedoan/${asset}`);
    expect(response.ok(), asset).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(100);
  }
});
