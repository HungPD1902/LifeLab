import { useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  Chips,
  Field,
  Gap,
  NotificationBanner,
  Radio,
  Row,
  Screen,
  SearchField,
  Section,
  StatsRow,
  T,
  TabSegments,
} from '../components/ui';
import {
  ClassCard,
  ItemDetailCard,
  LearnResultItem,
  LessonItem,
  MascotEvolutionRow,
  MascotStageCard,
  NotificationRow,
  ScenarioDialogueBox,
  SkillCard,
  StarRewardBadge,
  StarScoreBanner,
  StreakWeekBadge,
  SuccessPillBanner,
  TaskCard,
} from '../components/content';
import { OtpField } from '../components/brand';
import { colors } from '../design-system/tokens';
import { back } from '../navigation';

export function ComponentsShowcaseScreen() {
  const [tab, setTab] = useState('Tuần này');
  const [chipCategory, setChipCategory] = useState('An toàn');
  const [searchValue, setSearchValue] = useState('');
  const [textValue, setTextValue] = useState('LifeLab Student');
  const [checked, setChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('opt1');
  const [otp, setOtp] = useState('123456');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(0);

  return (
    <Screen title="Design System (Node 8:2)" onBack={() => back('home')}>
      <T muted size={12}>
        Bộ sưu tập chuẩn xác các UI Components thiết kế từ Figma Design System Node 8:2, bao gồm đổ bóng 3D, Card elevation và trạng thái tương tác.
      </T>

      <Gap size={20} />
      <Section title="1. Button (3 Kích cỡ, 3D Bottom Bevel & States)" />
      <View style={{ gap: 12 }}>
        <T bold size={12} style={{ color: colors.primary[800] }}>
          Large (48px) — Primary, Outline, Disabled
        </T>
        <Button label="Bắt đầu học ngay" size="large" icon="play" onPress={() => {}} />
        <Button
          label="Nút Outline với Icon Phải"
          variant="outline"
          size="large"
          iconRight="arrow-right"
          onPress={() => {}}
        />
        <Button label="Đã vô hiệu hóa" size="large" disabled onPress={() => {}} />

        <T bold size={12} style={{ color: colors.primary[800], marginTop: 6 }}>
          Medium (40px) — 2 Cột
        </T>
        <Row style={{ gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Button label="Xác nhận" size="medium" onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Hủy bỏ" variant="outline" size="medium" onPress={() => {}} />
          </View>
        </Row>

        <T bold size={12} style={{ color: colors.primary[800], marginTop: 6 }}>
          Small (32px) — Primary, Soft, Disabled, Text
        </T>
        <Row style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button label="Chi tiết" small onPress={() => {}} />
          <Button label="Đang học" small variant="soft" onPress={() => {}} />
          <Button label="Đã khóa" small disabled onPress={() => {}} />
          <Button label="Xem thêm" small variant="text" onPress={() => {}} />
        </Row>
      </View>

      <Gap size={24} />
      <Section title="2. Thẻ Nhiệm vụ, Kỹ năng & Lớp học (❖ Card)" />
      <View style={{ gap: 12 }}>
        <T bold size={12} style={{ color: colors.primary[800] }}>
          Card_task (Nhiệm vụ với Tiến độ & Đổ bóng)
        </T>
        <TaskCard
          task={{
            id: 'demo-1',
            title: 'Thực hành an toàn khi có cháy',
            category: 'An toàn',
            className: 'Lớp kỹ năng 8A',
            progress: 40,
            due: '15/10/2026',
            status: 'Đang làm',
          }}
          onPress={() => {}}
        />

        <T bold size={12} style={{ color: colors.primary[800], marginTop: 4 }}>
          Card_Skill (Kỹ năng Thư viện)
        </T>
        <SkillCard
          title="An toàn khi có cháy"
          description="Nhận biết và xử lý tình huống cháy nổ"
          progress={60}
          onPress={() => {}}
        />

        <T bold size={12} style={{ color: colors.primary[800], marginTop: 4 }}>
          Card_class (Lớp học)
        </T>
        <ClassCard
          name="Lớp Kỹ năng sinh tồn"
          role="owner"
          onPress={() => {}}
        />
      </View>

      <Gap size={24} />
      <Section title="3. Input & Form (Field, Search, Checkbox, Radio, OTP)" />
      <View style={{ gap: 12 }}>
        <Field
          label="Họ và tên"
          required
          placeholder="Nhập họ và tên học sinh"
          value={textValue}
          onChangeText={setTextValue}
          iconLeft="user"
          clearable
          caption="Tên hiển thị trên bảng xếp hạng và lớp học"
        />

        <Field
          label="Mật khẩu"
          placeholder="Nhập mật khẩu an toàn"
          secureTextEntry
          caption="Tối thiểu 6 ký tự"
        />

        <Field
          label="Trường hợp có lỗi"
          placeholder="Nhập email"
          value="invalid-email"
          error="Địa chỉ email không đúng định dạng"
        />

        <T bold size={13}>
          Tìm kiếm (Search Pill)
        </T>
        <SearchField
          label="Tìm kiếm bài học"
          placeholder="Tìm kỹ năng hoặc bài tập..."
          value={searchValue}
          onChangeText={setSearchValue}
        />

        <T bold size={13}>
          Chips danh mục (Pills)
        </T>
        <Chips
          options={['Tất cả', 'Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội']}
          value={chipCategory}
          onChange={setChipCategory}
        />

        <Card style={{ padding: 14, gap: 12 }}>
          <T bold size={13}>
            Lựa chọn (Checkbox & Radio)
          </T>
          <Checkbox
            label="Đã đọc và đồng ý với điều khoản an toàn"
            caption="Cần thiết trước khi bắt đầu bài học tình huống"
            checked={checked}
            onChange={setChecked}
          />
          <Radio
            label="Chế độ âm thanh đầy đủ"
            description="Phát âm thanh hướng dẫn và hiệu ứng tiếng động"
            selected={radioSelected === 'opt1'}
            onPress={() => setRadioSelected('opt1')}
          />
          <Radio
            label="Chế độ im lặng"
            description="Chỉ hiển thị văn bản mô tả tình huống"
            selected={radioSelected === 'opt2'}
            onPress={() => setRadioSelected('opt2')}
          />
        </Card>

        <T bold size={13} style={{ marginTop: 4 }}>
          Mã xác thực (OTP 6 số chuẩn Figma)
        </T>
        <OtpField value={otp} onChangeText={setOtp} />
      </View>

      <Gap size={24} />
      <Section title="4. Lesson Component (❖ Lesson - 3 Trạng thái)" />
      <View style={{ gap: 10 }}>
        <LessonItem index={1} title="Nhận biết đám cháy" status="completed" />
        <LessonItem index={2} title="Xử lý tình huống thoát nạn" status="in_progress" />
        <LessonItem index={3} title="Kiểm tra kiến thức an toàn" status="locked" />
      </View>

      <Gap size={24} />
      <Section title="5. Stats Row & Tabs (❖ stats_row & ❖ tab)" />
      <StatsRow completed={12} inProgress={3} notStarted={5} />
      <Gap size={12} />
      <TabSegments
        options={['Tuần này', 'Tháng này', 'Tất cả']}
        value={tab}
        onChange={setTab}
      />

      <Gap size={24} />
      <Section title="6. Notifications & Banners (❖ Notification 4 Màu Chuẩn)" />
      <SuccessPillBanner message="Chúc mừng bạn đã hoàn thành An toàn điện" />
      <Gap size={8} />
      <NotificationBanner
        type="success"
        title="Nhiệm vụ hoàn thành"
        text="Bạn đã nhận được +80 Sao và +20 Mảnh Mascot!"
      />
      <NotificationBanner
        type="info"
        title="Bài học mới mở khóa"
        text="Bài 3: Xử lý tình huống đám cháy đã sẵn sàng."
      />
      <NotificationBanner
        type="warning"
        title="Nhắc nhở học tập"
        text="Còn 2 ngày trước khi nhiệm vụ tuần kết thúc."
      />
      <NotificationBanner
        type="error"
        title="Chưa đạt yêu cầu"
        text="Bạn cần đạt tối thiểu 70 điểm để mở khóa bài tiếp theo."
      />

      <Gap size={14} />
      <Section title="Notification Row List" />
      <NotificationRow
        initials="CR"
        title="Ronaldo đã thích bài viết của bạn"
        subtitle="Kỹ năng An toàn · 2 giờ trước"
        unread
        iconRight="heart"
      />
      <NotificationRow
        initials="CS"
        title="Costas đã nộp bài tập thực hành"
        subtitle="Lớp Kỹ năng sống 8A · 3 giờ trước"
        unread
      />

      <Gap size={24} />
      <Section title="7. Vật phẩm chi tiết (❖ Vật phẩm_detail & Card_Vật phẩm)" />
      <ItemDetailCard
        title="Ba lô cắm trại"
        category="Tự lập"
        description="Mở khóa khi hoàn thành trọn bộ kỹ năng An toàn ngoài trời."
        status="equipped"
      />

      <Gap size={24} />
      <Section title="8. Tiến trình Mascot (❖ Mascot 3 Giai đoạn)" />
      <MascotEvolutionRow currentStage={2} />
      <Gap size={12} />
      <MascotStageCard
        category="An toàn"
        stage={2}
        maxStage={3}
        currentExp={50}
        maxExp={100}
      />

      <Gap size={24} />
      <Section title="9. Gamification & Tình huống (Streak, Star, Quiz)" />
      <StreakWeekBadge streakDays={7} />
      <Gap size={12} />
      <StarScoreBanner score={85} stars={80} shards={20} />
      <Gap size={12} />
      <Row style={{ justifyContent: 'center' }}>
        <StarRewardBadge stars={8} />
      </Row>
      <Gap size={12} />
      <View style={{ gap: 6 }}>
        <LearnResultItem text="Học được các kỹ năng thoát hiểm khi có cháy" />
        <LearnResultItem text="Biết cách lấy khăn ướt bịt mũi miệng khi có khói" />
      </View>
      <Gap size={14} />
      <ScenarioDialogueBox
        speaker="LifeLab Bạn đồng hành"
        dialogue="Khói đang len qua khe cửa phòng... Bạn nên làm gì ngay lúc này?"
        selectedIndex={quizAnswer}
        onSelect={setQuizAnswer}
        choices={[
          { text: 'Dùng khăn hoặc vải ướt chèn kín khe cửa', correct: true },
          { text: 'Mở toang cửa sổ và nhảy xuống', correct: false },
          { text: 'Trốn vào tủ quần áo và đóng cửa lại', correct: false },
        ]}
        explanation="Dùng khăn ướt chặn khe cửa giúp ngăn khói độc xâm nhập, duy trì không khí an toàn để chờ cứu hộ."
      />
      <Gap size={30} />
    </Screen>
  );
}
