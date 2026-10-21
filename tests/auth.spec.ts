import { test, expect } from '@playwright/test';

test('login rejects empty and incorrect credentials before accepting the demo account', async ({
  page,
}) => {
  for (const [email, password] of [
    ['', ''],
    ['other@example.com', 'DoAn2026@123'],
    ['duchung@example.com', 'wrong-password'],
    ['duchung@example.com', ' DoAn2026@123 '],
  ]) {
    await page.goto('/login');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Mật khẩu', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByText('Email hoặc mật khẩu không đúng.', { exact: true }).filter({ visible: true }),
    ).toBeVisible();
  }
  await page.getByLabel('Email', { exact: true }).fill(' DUCHUNG@EXAMPLE.COM ');
  await expect(
    page.getByText('Email hoặc mật khẩu không đúng.', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
  await page.getByLabel('Mật khẩu', { exact: true }).fill('DoAn2026@123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText('Xin chào Đức Hưng').filter({ visible: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Cá nhân', exact: true }).click();
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(
    page.getByText('Đăng xuất?', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).last().click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Mật khẩu', { exact: true })).toHaveValue('');
});

test('social sign-in placeholders do not bypass the fixed login', async ({ page }) => {
  await page.goto('/login');
  for (const provider of ['Google', 'Apple']) {
    await page.getByRole('button', { name: `Tiếp tục với ${provider}`, exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.getByRole('button', { name: 'Đã hiểu', exact: true }).click();
  }
});

test('registration accepts arbitrary fields and verifies only OTP 123456 for its masked phone', async ({
  page,
}) => {
  await page.goto('/register');
  await page.getByLabel('Họ và tên', { exact: true }).fill('');
  await page.getByLabel('Email', { exact: true }).fill('email-demo-bat-ky');
  await page.getByLabel('Số điện thoại', { exact: true }).fill('0912 345 678');
  await page.getByLabel('Mật khẩu', { exact: true }).fill('abc');
  await page.getByLabel('Xác nhận mật khẩu', { exact: true }).fill('khac-mat-khau');
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await expect(page).toHaveURL(/\/verify$/);
  await expect(
    page.getByText('******5678', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.screenshot({ path: 'docs/preview/verify.png' });
  await expect(
    page.getByText('email-demo-bat-ky', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
  for (const code of ['', '12345', '654321']) {
    await page.getByLabel('Mã xác thực', { exact: true }).fill(code);
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await expect(page).toHaveURL(/\/verify$/);
    await expect(
      page.getByText('Mã xác thực không đúng.', { exact: true }).filter({ visible: true }),
    ).toBeVisible();
  }
  await page.getByRole('button', { name: 'Gửi lại mã', exact: true }).click();
  await page.getByLabel('Mã xác thực', { exact: true }).fill('123456');
  await expect(
    page.getByText('Mã xác thực không đúng.', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(page).toHaveURL(/\/signup-success$/);
});

test('blank and short registration phones never block the preview or expose all digits', async ({
  page,
}) => {
  for (const [phone, masked] of [
    ['', '******'],
    ['123', '*23'],
  ]) {
    await page.goto('/register');
    await page.getByLabel('Số điện thoại', { exact: true }).fill(phone);
    await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
    await expect(page.getByText(masked, { exact: true }).filter({ visible: true })).toBeVisible();
    await page.getByLabel('Mã xác thực', { exact: true }).fill('123456');
    await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
    await expect(page).toHaveURL(/\/signup-success$/);
  }
});

test('password reset preview also requires the fixed OTP and returns to login', async ({
  page,
}) => {
  await page.goto('/forgot-password');
  await page.getByLabel('Email', { exact: true }).fill('reset-demo@example.com');
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
  await expect(
    page.getByText('reset-demo@example.com', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByLabel('Mã xác thực', { exact: true }).fill('999999');
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(page).toHaveURL(/\/verify\?mode=reset/);
  await page.getByLabel('Mã xác thực', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});
