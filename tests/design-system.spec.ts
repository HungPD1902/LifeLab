import { test, expect } from '@playwright/test';

test('six-box OTP supports paste and deletion on a small screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/register');
  await page.getByLabel('Số điện thoại', { exact: true }).fill('0912345678');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page.getByText('******5678').filter({ visible: true })).toBeVisible();
  const otp = page.getByLabel('Mã xác thực', { exact: true });
  await otp.fill('123456');
  await expect(page.getByTestId('otp-digit')).toHaveText(['1', '2', '3', '4', '5', '6']);
  await otp.press('Backspace');
  await expect(otp).toHaveValue('12345');
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(page.getByText('Mã xác thực không đúng.').filter({ visible: true })).toBeVisible();
  await otp.fill('123456');
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(page).toHaveURL(/signup-success$/);
});

test('library search filters static skills and opens the chosen skill', async ({ page }) => {
  await page.goto('/skills');
  await page.getByRole('button', { name: 'Tìm kiếm kỹ năng', exact: true }).click();
  await expect(page).toHaveURL(/skill-search$/);
  await page
    .getByRole('textbox', { name: 'Tìm kiếm kỹ năng', exact: true })
    .fill('không có kỹ năng này');
  await expect(page.getByText('Không tìm thấy kỹ năng').filter({ visible: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Tìm kiếm kỹ năng', exact: true }).fill('cháy');
  await page.getByRole('button', { name: 'An toàn', exact: true }).click();
  await page.getByRole('button', { name: 'Thực hành an toàn khi có cháy', exact: true }).click();
  await expect(page).toHaveURL(/skill-detail/);
  await expect(
    page.getByText('Thực hành an toàn khi có cháy', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await expect(page).toHaveURL(/skill-search/);
});

test('a failed custom font download still leaves the UI usable', async ({ page }) => {
  let blocked = false;
  await page.route('**/Capriola-Regular*.ttf', async (route) => {
    blocked = true;
    await route.abort();
  });
  await page.goto('/home');
  await expect(page.getByText('Xin chào Đức Hưng').filter({ visible: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Thư viện', exact: true }).click();
  await expect(page).toHaveURL(/skills$/);
  await expect(page.getByRole('button', { name: 'An toàn', exact: true })).toBeVisible();
  await expect.poll(() => blocked).toBe(true);
});
