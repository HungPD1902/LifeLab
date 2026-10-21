export const categories = [
  {
    name: 'Tự lập',
    icon: 'home',
    count: 12,
    done: 6,
    description: 'Chăm sóc bản thân',
    fullDescription: 'Tự tin chăm sóc bản thân và chủ động trong cuộc sống.',
  },
  {
    name: 'An toàn',
    icon: 'shield',
    count: 8,
    done: 2,
    description: 'Nhận biết và xử lý nguy cơ',
    fullDescription: 'Nhận biết nguy hiểm và biết cách xử lý trong các tình huống thường gặp.',
  },
  {
    name: 'Sức khỏe',
    icon: 'heart',
    count: 10,
    done: 4,
    description: 'Xây dựng thói quen tốt',
    fullDescription: 'Xây dựng thói quen tốt và chăm sóc sức khỏe mỗi ngày.',
  },
  {
    name: 'Xã hội',
    icon: 'users',
    count: 9,
    done: 3,
    description: 'Giao tiếp và ứng xử',
    fullDescription: 'Học cách lắng nghe, chia sẻ và kết nối với mọi người.',
  },
] as const;
export type Task = {
  id: string;
  title: string;
  category: string;
  className: string;
  progress: number;
  due: string;
  status: 'Đang làm' | 'Chưa làm' | 'Đã hoàn thành';
  description?: string;
};
export const tasks: Task[] = [
  {
    id: '0',
    title: 'Thực hành an toàn khi có cháy',
    category: 'An toàn',
    className: 'Lớp kỹ năng 8A',
    progress: 40,
    due: '15/10/2026',
    status: 'Đang làm',
  },
  {
    id: '1',
    title: 'Lập kế hoạch chi tiêu cá nhân',
    category: 'Tự lập',
    className: 'Lớp kỹ năng 8B',
    progress: 0,
    due: '22/10/2026',
    status: 'Chưa làm',
  },
  {
    id: '2',
    title: 'Kỹ năng giao tiếp nhóm',
    category: 'Xã hội',
    className: 'Lớp kỹ năng 8A',
    progress: 100,
    due: '04/10/2026',
    status: 'Đã hoàn thành',
  },
];
export const lessons = [
  'Nhận biết nguy cơ cháy nổ',
  'Kỹ năng thoát hiểm cơ bản',
  'Xử lý tình huống',
  'Kiểm tra kiến thức',
];
export const members = [
  { name: 'Nguyễn Văn A', progress: 85 },
  { name: 'Trần Thị B', progress: 42 },
  { name: 'Lê Hoàng C', progress: 100 },
  { name: 'Phạm Minh D', progress: 0 },
  { name: 'Võ Hồng E', progress: 73 },
  { name: 'Đặng Quốc F', progress: 90 },
];
export const items = [
  { name: 'Ba lô cắm trại', category: 'Tự lập', icon: 'briefcase', unlocked: true },
  { name: 'Trang phục cứu hỏa', category: 'An toàn', icon: 'truck', unlocked: true },
  { name: 'Mũ đầu bếp', category: 'Sức khỏe', icon: 'coffee', unlocked: false },
  { name: 'Phụ kiện tình bạn', category: 'Xã hội', icon: 'heart', unlocked: false },
] as const;
