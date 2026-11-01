export const gameDoanSections = [
  {
    title: 'Khám phá',
    screens: [
      { view: 'home', title: 'Trang đầu', description: 'Biệt đội an toàn và hành trình học.' },
      { view: 'library', title: 'Thư viện', description: 'Danh mục và gợi ý kỹ năng.' },
      { view: 'safety', title: 'Danh mục An toàn', description: 'Danh sách và tìm kiếm kỹ năng.' },
      {
        view: 'fire',
        title: 'An toàn khi có cháy',
        description: 'Chi tiết, lưu kỹ năng và tiến độ 4 bài.',
      },
    ],
  },
  {
    title: 'Học và chơi',
    screens: [
      {
        view: 'lesson-1',
        title: 'Bài 1 · Nhận biết',
        description: 'Ba thẻ nhận biết nguy cơ trong phòng.',
      },
      {
        view: 'lesson-2',
        title: 'Bài 2 · Thoát hiểm',
        description: 'Ba thẻ kỹ năng thoát hiểm cơ bản.',
      },
      {
        view: 'briefing',
        title: 'Bài 3 · Hướng dẫn chơi',
        description: 'Mục tiêu, luật chơi và nút vào game.',
      },
      {
        view: 'play',
        title: 'Game · Căn phòng an toàn',
        description: 'Tìm nguy cơ, hoạt cảnh, gợi ý, sổ tay và âm thanh.',
      },
      {
        view: 'quiz',
        title: 'Bài 4 · Kiểm tra',
        description: 'Năm câu hỏi và phản hồi từng lựa chọn.',
      },
    ],
  },
  {
    title: 'Cá nhân',
    screens: [
      { view: 'saved', title: 'Kỹ năng đã lưu', description: 'Các kỹ năng đã đánh dấu.' },
      { view: 'profile', title: 'Hành trình của em', description: 'Bài đã học, EXP và xu cho Tí.' },
    ],
  },
] as const;

export type GameDoanView = (typeof gameDoanSections)[number]['screens'][number]['view'];

export function getGameDoanView(value: string | string[] | undefined): GameDoanView {
  for (const section of gameDoanSections) {
    for (const screen of section.screens) {
      if (screen.view === value) return screen.view;
    }
  }
  return 'library';
}
