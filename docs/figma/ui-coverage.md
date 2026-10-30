# Phạm vi UI Figma — 30/10/2026

Chỉ đọc file Figma; không sửa trang Wireframe, UI hay Design System. Màu, chữ và các biến thể component được dựng thành React Native để tái sử dụng. Ảnh dùng file local trong `assets/figma/`.

## Các route đã dùng UI hiện có

42 route dùng bộ component UI. Registry wireframe 57 frame vẫn được giữ; có thêm Quên mật khẩu và Tìm kiếm kỹ năng. Route `/classes` tự hiển thị trạng thái trống hoặc danh sách lớp theo dữ liệu demo.

| Route | Node UI nguồn |
| --- | --- |
| `/` | [466:6818](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-6818) |
| `/onboarding-1` | [466:6845](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-6845) |
| `/onboarding-2` | [473:11378](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=473-11378) |
| `/onboarding-3` | [473:11409](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=473-11409) |
| `/login` | [475:11441](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=475-11441) |
| `/register` | [475:11479](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=475-11479) |
| `/verify` | [481:11952](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=481-11952) |
| `/signup-success` | [481:12224](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=481-12224) |
| `/home` | [582:3667](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=582-3667) |
| `/home-empty` | [582:3481](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=582-3481) |
| `/tasks` | [582:3351](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=582-3351) |
| `/suggestions` | [582:3421](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=582-3421) |
| `/skills` | [511:8330](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-8330) |
| `/skill-search` | [511:8263](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-8263) |
| `/skill-category` | [511:8088](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-8088) |
| `/skill-detail` | [511:7750](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-7750) |
| `/lesson-1` | [511:7836](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-7836) |
| `/lesson-2` | [511:7895](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-7895) |
| `/lesson-3` | [511:7954](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-7954) |
| `/lesson-4` | [511:8023](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-8023) |
| `/result` | [511:8169](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=511-8169) |
| `/classes` | [466:7456](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-7456) |
| `/classes-list` | [601:5007](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=601-5007) |
| `/class-create` | [466:8017](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-8017) |
| `/class-created` | [609:8328](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=609-8328) |
| `/class-detail` | [609:8709](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=609-8709) |
| `/class-members` | [466:7245](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-7245) |
| `/class-member-detail` | [466:7399](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-7399) |
| `/class-pending` | [466:8040](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-8040) |
| `/class-accept` | [608:7518](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=608-7518) |
| `/class-reject` | [608:7678](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=608-7678) |
| `/class-pending-empty` | [466:8187](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=466-8187) |
| `/class-ranking` | [606:5363](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=606-5363) |
| `/profile` | [505:4184](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4184) |
| `/settings` | [505:4261](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4261) |
| `/profile-edit` | [505:4288](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4288) |
| `/streak` | [505:4306](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4306) |
| `/ranking` | [505:4424](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4424) |
| `/collection` | [505:4513](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4513) |
| `/item-detail` | [509:6803](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=509-6803) |
| `/mascot` | [505:4521](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4521) |
| `/mascot-detail` | [505:4554](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=505-4554) |

## Các route giữ wireframe

`/forgot-password`, `/notifications`, `/class-join`, `/class-code`, `/class-request`, `/class-request-sent`, `/class-joined`, `/class-members-view`, `/class-tasks`, `/class-task-create`, `/class-task-detail`, `/class-task-progress`, `/class-tasks-member`, `/class-task-member`, `/class-progress`, `/class-settings`, `/class-leave`.

Các frame này còn màu xám/wireframe hoặc chưa có UI riêng. Không tự áp màu toàn app. `src/design-system/coverage.ts` là danh sách opt-in: một màn chỉ nhận theme UI khi được thêm vào danh sách sau khi đối chiếu thiết kế.

## Component dùng chung

Import tập trung từ `src/design-system/index.ts`:

```tsx
import { Button, Field, SearchField, Checkbox, Card, SkillCard, BrandLogo, OtpField } from '../design-system';
```

| Thành phần code | Nguồn Design System |
| --- | --- |
| Màu neutral/primary | `107:3169` |
| Capriola, thang chữ | `242:2148` |
| Button primary/outline/text, pressed/disabled, 48/40/32 | `131:7080` |
| Field, Checkbox, Radio, SearchField | Input / Checkbox / Search `448:2153` |
| Card, TaskCard, SkillCard, CategoryGrid | Card_task `428:14221`, Card_Task `429:14557`, Card_Skill `449:4004`, skill_card `449:3785` |
| Progress, Badge, Chips, Segments | Progress `422:12736`, Chip `448:2161`, Tab `422:12155` |
| Avatar, MemberRow, Stats, MenuRow/MenuGroup | member_container `423:13617`, stats_row `424:13870`, Row `506:5243` |
| Header, BottomTabs | Các instance Header / Navigation Bar trên trang UI |
| BrandLogo, StepProgress, OtpField | Nhóm auth `475:11440` |

Các component tương tác dùng code thật, không dùng ảnh chụp component. Icon hiện dùng bộ Feather có sẵn trong project, ánh xạ theo biểu tượng của thiết kế; chưa xuất từng vector icon riêng từ Figma.

## Phần thiết kế còn chờ

- Onboarding, đăng ký thành công và ảnh kỹ năng vẫn là ảnh checkerboard trong Figma; giữ đúng ảnh nguồn chờ thiết kế.
- Home/mascot và vật phẩm còn ô ảnh placeholder; giữ các ô xanh/xám theo thiết kế, không vẽ thêm ảnh mới.
- Chưa coi đây là bản khớp pixel cuối cùng; dữ liệu/nội dung demo và những hành động đã có vẫn hoạt động.
- Figma MCP đã hết lượt đọc sau khi lấy logo, ảnh nguồn và metadata. Đối chiếu bố cục còn lại qua trình xem Figma ở chế độ chỉ đọc.
