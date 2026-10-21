import { test, expect } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { screenMeta } from '../src/data/screens';

test('every Figma screen frame has a unique route', () => {
  const xml = readFileSync('docs/figma/wireframe.xml', 'utf8');
  const ids = [...xml.matchAll(/^    <frame id="([\d:]+)"/gm)].map((m) => m[1]);
  const mapped = Object.values(screenMeta)
    .map((m) => m.node)
    .filter(Boolean);
  expect(ids.length).toBe(57);
  expect(new Set(mapped).size).toBe(mapped.length);
  expect(ids.filter((id) => !mapped.includes(id as (typeof mapped)[number]))).toEqual([]);
});

test('onboarding, registration and four main tabs navigate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Tiếp theo', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Tiếp theo', exact: true }).click();
  await expect(page).toHaveURL(/onboarding-2/);
  await page.getByRole('button', { name: 'Tiếp theo', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu ngay', exact: true }).click();
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Ngọc Anh');
  await page.getByRole('checkbox').click();
  await page.getByRole('button', { name: 'Đăng ký', exact: true }).click();
  await page.getByLabel('Mã xác thực', { exact: true }).fill('123456');
  await page.getByRole('button', { name: 'Xác nhận', exact: true }).click();
  await expect(
    page.getByText('Đăng ký thành công!', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Bắt đầu học', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page
    .getByLabel('Email', { exact: true })
    .filter({ visible: true })
    .fill('duchung@example.com');
  await page.getByLabel('Mật khẩu', { exact: true }).filter({ visible: true }).fill('DoAn2026@123');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  for (const [tab, path] of [
    ['Kỹ năng', '/skills'],
    ['Lớp học', '/classes'],
    ['Cá nhân', '/profile'],
    ['Trang chủ', '/home'],
  ]) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(path + '$'));
  }
  await expect(page.getByText('Xin chào Đức Hưng').filter({ visible: true })).toBeVisible();
});

test('task filter and all four lessons lead to results', async ({ page }) => {
  await page.goto('/tasks');
  await page.getByRole('button', { name: 'Chưa làm', exact: true }).click();
  await expect(
    page.getByText('Lập kế hoạch chi tiêu cá nhân', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Thực hành an toàn khi có cháy', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
  await page.goto('/skills');
  await page.getByRole('button', { name: 'An toàn', exact: true }).click();
  await page.getByRole('button', { name: 'An toàn khi có cháy', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu học', exact: true }).click();
  for (const step of [1, 2, 3]) {
    await expect(page).toHaveURL(new RegExp(`lesson-${step}`));
    await page.getByRole('button', { name: 'Bắt đầu', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
  await expect(page).toHaveURL(/result/);
  await expect(page.getByText('80', { exact: true }).filter({ visible: true })).toBeVisible();
  await page.getByRole('button', { name: 'Chơi lại để cải thiện điểm', exact: true }).click();
  await expect(page).toHaveURL(/lesson-1/);
});

test('create a class, create a task and reject a pending member', async ({ page }) => {
  await page.goto('/classes');
  await page.getByRole('button', { name: 'Tạo lớp', exact: true }).click();
  await expect(
    page.getByText('Tạo lớp học', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Tạo lớp', exact: true }).click();
  await expect(page.getByText('Vui lòng nhập tên lớp.').filter({ visible: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Tên lớp*', exact: true }).fill('Lớp LifeLab 2026');
  await page.getByRole('button', { name: 'Tạo lớp', exact: true }).click();
  await expect(
    page.getByText('Tạo lớp thành công', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Xem lớp ngay', exact: true }).click();
  await expect(
    page.getByText('Lớp LifeLab 2026', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Nhiệm vụ', exact: true }).click();
  await page.getByRole('button', { name: 'Tạo nhiệm vụ', exact: true }).click();
  await page.getByRole('textbox', { name: 'Tên nhiệm vụ', exact: true }).fill('Dọn góc học tập');
  await page.getByRole('button', { name: 'Tạo nhiệm vụ', exact: true }).click();
  await expect(
    page.getByText('Dọn góc học tập', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Dọn góc học tập', exact: true }).click();
  await expect(
    page.getByText('Dọn góc học tập', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Chỉnh sửa', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Tên nhiệm vụ', exact: true })
    .fill('Sắp xếp góc học tập');
  await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
  await expect(
    page.getByText('Sắp xếp góc học tập', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Dọn góc học tập', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
  await page.goto('/class-pending');
  await page.getByRole('button', { name: 'Từ chối', exact: true }).first().click();
  await expect(
    page.getByText('Từ chối thành viên?', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Hủy', exact: true }).click();
  await expect(
    page.getByText('Nguyễn Minh Anh', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Từ chối', exact: true }).first().click();
  await expect(
    page.getByText('Từ chối thành viên?', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Từ chối', exact: true }).last().click();
  await expect(
    page.getByText('Nguyễn Minh Anh', { exact: true }).filter({ visible: true }),
  ).toHaveCount(0);
});

test('join code validation, request success, equipment and profile edit', async ({ page }) => {
  await page.goto('/class-code');
  await page.getByRole('button', { name: 'Tìm lớp', exact: true }).click();
  await expect(
    page.getByText('Mã lớp gồm 6 ký tự. Thử ABC123.').filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Mã lớp', exact: true }).fill('ABC123');
  await page.getByRole('button', { name: 'Tìm lớp', exact: true }).click();
  await page.getByRole('button', { name: 'Gửi yêu cầu tham gia', exact: true }).click();
  await expect(
    page.getByText('Gửi yêu cầu thành công', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Về lớp học', exact: true }).click();
  await page.getByRole('tab', { name: 'Cá nhân', exact: true }).click();
  await page.getByRole('button', { name: 'Bộ sưu tập', exact: true }).click();
  await page.getByRole('button', { name: 'Trang bị', exact: true }).click();
  await expect(
    page.getByText('Đang sử dụng', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.goto('/profile-edit');
  await page.getByRole('textbox', { name: 'Họ và tên', exact: true }).fill('Minh Anh');
  await page.getByRole('button', { name: 'Lưu thay đổi', exact: true }).click();
  await expect(page.getByText('Minh Anh', { exact: true }).filter({ visible: true })).toBeVisible();
});

test('every route renders without runtime errors or horizontal overflow', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const id of Object.keys(screenMeta)) {
    await page.goto(id === 'splash' ? '/' : '/' + id);
    await expect(page.getByText('9:41', { exact: true }).filter({ visible: true })).toBeVisible();
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(
      page.getByText('Không tìm thấy màn hình', { exact: true }).filter({ visible: true }),
    ).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('Uncaught Error');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      id,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('capture the four main screens at wireframe size', async ({ page }) => {
  mkdirSync('docs/preview', { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of ['home', 'skills', 'classes', 'profile']) {
    await page.goto('/' + name);
    await page
      .getByRole('tab', {
        name: { home: 'Trang chủ', skills: 'Kỹ năng', classes: 'Lớp học', profile: 'Cá nhân' }[
          name
        ]!,
        exact: true,
      })
      .waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `docs/preview/${name}.png` });
  }
});

test('regression: selecting a member class keeps the owner class in the list', async ({ page }) => {
  await page.goto('/classes-list');
  await page.getByRole('button').filter({ hasText: 'Lớp Nấu ăn cơ bản' }).click();
  await expect(
    page.getByText('Thông tin lớp', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Quay lại', exact: true }).click();
  await expect(
    page.getByText('Lớp Kỹ năng sinh tồn', { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Lớp Nấu ăn cơ bản', { exact: true }).filter({ visible: true }),
  ).toHaveCount(1);
});

test('regression: mascot selection is preserved in customization', async ({ page }) => {
  await page.goto('/mascot');
  await page.getByRole('button', { name: 'Tự lập', exact: true }).click();
  await page.getByRole('button', { name: 'Tùy chỉnh mascot', exact: true }).click();
  await expect(page.getByText('Tự lập', { exact: true }).filter({ visible: true })).toBeVisible();
  await expect(page.getByText('An toàn', { exact: true }).filter({ visible: true })).toHaveCount(0);
});

test('member history opens the member task flow and small screens keep footer usable', async ({
  page,
}) => {
  await page.goto('/class-members-view');
  await page.getByRole('button', { name: 'Nguyễn Văn A', exact: true }).click();
  await page.getByRole('button', { name: 'Nhiệm vụ 1: Chuẩn bị bữa sáng', exact: true }).click();
  await expect(page).toHaveURL(/class-task-member/);
  await expect(page.getByRole('button', { name: 'Chỉnh sửa', exact: true })).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/class-create');
  await expect(page.getByRole('button', { name: 'Tạo lớp', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tạo lớp', exact: true }).click();
  await expect(page.getByText('Vui lòng nhập tên lớp.').filter({ visible: true })).toBeVisible();
});
