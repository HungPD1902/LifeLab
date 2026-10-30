import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';
import {
  Button,
  Card,
  Gap,
  Icon,
  IconButton,
  Chips,
  Empty,
  SearchField,
  Progress,
  Row,
  Screen,
  Section,
  S,
  Stats,
  T,
} from '../components/ui';
import { usePalette } from '../design-system/theme';
import { themeColors } from '../design-system/tokens';
import { skills } from '../data/skills';
import {
  CategoryGrid,
  LearnResultItem,
  LessonItem,
  ScenarioDialogueBox,
  SkillCard,
  StarScoreBanner,
  TaskCard,
} from '../components/content';
import { categories, lessons, tasks } from '../data/content';
import type { ScreenId } from '../data/screens';
import { back, go } from '../navigation';

export function LibraryScreen() {
  return (
    <Screen
      title="Thư viện"
      tabs="skills"
      onBack={() => go('home', {}, true)}
      right={
        <IconButton name="search" label="Tìm kiếm kỹ năng" onPress={() => go('skill-search')} />
      }
    >
      <CategoryGrid />
      <Gap size={24} />
      <Section title="Gợi ý cho bạn" action="Xem tất cả" onPress={() => go('suggestions')} />
      <View style={{ gap: 8 }}>
        {[skills[0], skills[2]].map((skill) => (
          <SkillCard
            key={skill.title}
            {...skill}
            onPress={() => go('skill-detail', { title: skill.title })}
          />
        ))}
      </View>
    </Screen>
  );
}
function SkillSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLowerCase();
  const searchTasks = [
    tasks[1],
    { ...tasks[1], id: 'first-aid', title: 'Sơ cứu vết trầy xước', category: 'Sức khỏe' },
    tasks[0],
  ];
  const visible = searchTasks.filter(
    (skill) =>
      (category === 'Tất cả' || skill.category === category) &&
      normalize(skill.title).includes(normalize(query.trim())),
  );
  return (
    <Screen title="Tìm kiếm" tabs="skills" onBack={() => back('skills')}>
      <SearchField label="Tìm kiếm kỹ năng" value={query} onChangeText={setQuery} />
      <Chips
        options={['Tất cả', 'Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội']}
        value={category}
        onChange={setCategory}
        small
      />
      <View style={{ gap: 8 }}>
        {visible.map((skill) => (
          <TaskCard
            key={skill.title}
            task={skill}
            suggestion
            onPress={() => go('skill-detail', { title: skill.title, category: skill.category })}
          />
        ))}
      </View>
      {!visible.length && (
        <Empty
          icon="search"
          title="Không tìm thấy kỹ năng"
          description="Thử từ khóa hoặc danh mục khác."
        />
      )}
    </Screen>
  );
}
function SkillArtwork({ height }: { height: number }) {
  return (
    <Image
      source={require('../../assets/figma/onboarding-image-source.png')}
      accessibilityLabel="Ảnh minh họa đang chờ thiết kế"
      resizeMode="cover"
      style={{ width: '100%', height, borderRadius: 8 }}
    />
  );
}
export function SkillScreen({ id }: { id: ScreenId }) {
  const params = useLocalSearchParams<{ category?: string; title?: string }>();
  const category = categories.find((c) => c.name === params.category) ?? categories[1];
  const title = params.title || 'An toàn khi có cháy';
  const [saved, setSaved] = useState(false);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const palette = usePalette();
  if (id === 'skill-search') return <SkillSearch />;
  if (id === 'skill-category') {
    const visible = skills.filter((skill) => skill.category === category.name);
    return (
      <Screen
        title="Thư viện"
        tabs="skills"
        onBack={() => go('skills', {}, true)}
        right={
          <IconButton name="search" label="Tìm kiếm kỹ năng" onPress={() => go('skill-search')} />
        }
      >
        <Card style={{ backgroundColor: palette.light, gap: 14 }}>
          <Row>
            <View style={{ padding: 13, borderRadius: 30, backgroundColor: palette.fill }}>
              <Icon name={category.icon} color="#fff" size={25} />
            </View>
            <View style={{ flex: 1 }}>
              <T bold size={17}>
                {category.name}
              </T>
              <T muted size={12}>
                {category.fullDescription}
              </T>
            </View>
          </Row>
          <Progress value={(category.done / category.count) * 100} height={5} />
          <T muted size={10}>
            {category.done}/{category.count} kỹ năng đã học
          </T>
        </Card>
        <Gap size={22} />
        <Section title="Danh sách kỹ năng" />
        <View style={{ gap: 10 }}>
          {visible.map((skill) => (
            <SkillCard
              key={skill.title}
              {...skill}
              onPress={() => go('skill-detail', { title: skill.title, category: category.name })}
            />
          ))}
        </View>
      </Screen>
    );
  }
  if (id === 'skill-detail')
    return (
      <Screen
        title={title}
        subtitle="KỸ NĂNG"
        onBack={() => back('skills')}
        right={
          <IconButton
            name={saved ? 'check' : 'bookmark'}
            label={saved ? 'Bỏ lưu kỹ năng' : 'Lưu kỹ năng'}
            onPress={() => setSaved(!saved)}
          />
        }
        footer={<Button label="Bắt đầu học" onPress={() => go('lesson-1', { title })} />}
      >
        <SkillArtwork height={100} />
        <Gap size={8} />
        <T muted size={12}>
          Luyện tập bằng nhiệm vụ, tìm lối thoát và gọi trợ giúp an toàn qua các tình huống trong
          game.
        </T>
        <Gap />
        <Row>
          <Progress value={25} height={5} />
          <T muted size={10}>
            1/4 bài
          </T>
        </Row>
        <Gap size={22} />
        <Section title="Bạn sẽ học được" />
        <View style={{ gap: 4, marginBottom: 12 }}>
          {[
            'Nhận biết nguy cơ cháy',
            'Biết cách xử lý khi phát hiện cháy',
            'Biết cách tìm lối thoát hiểm',
            'Biết cách gọi trợ giúp an toàn',
          ].map((t) => (
            <LearnResultItem key={t} text={t} />
          ))}
        </View>
        <Gap size={8} />
        <Section title="Bài học" />
        <View style={{ gap: 8 }}>
          {lessons.map((lesson, i) => (
            <LessonItem
              key={lesson}
              index={i + 1}
              title={i === 0 ? 'Nhận biết' : i === 3 ? 'Kiểm tra' : lesson}
              status={i === 0 ? 'completed' : i === 1 ? 'in_progress' : 'locked'}
              onPress={() => go(`lesson-${i + 1}` as ScreenId, { title })}
            />
          ))}
        </View>
      </Screen>
    );
  if (id === 'result')
    return (
      <Screen
        footer={
          <>
            <Button
              label="Tiếp tục bài tiếp theo"
              onPress={() => go('skill-detail', { title }, true)}
            />
            <Button
              label="Chơi lại để cải thiện điểm"
              variant="outline"
              icon="rotate-ccw"
              onPress={() => go('lesson-1', { title }, true)}
            />
          </>
        }
      >
        <StarScoreBanner
          score={80}
          maxScore={100}
          stars={80}
          shards={20}
          lessonTitle="Bài 3: Xử lý tình huống"
        />
        <Gap size={14} />
        <Stats
          data={[
            { value: '8/10', label: 'Câu đúng' },
            { value: '2', label: 'Câu chưa đúng' },
            { value: '04:30', label: 'Thời gian' },
          ]}
        />
        <Gap size={18} />
        <Section title="Kết quả học tập" />
        <Card style={{ backgroundColor: palette.light, gap: 14 }}>
          {[
            'Học được cách thoát hiểm an toàn khi có khói độc.',
            'Lựa chọn hành động chuẩn xác trong từng tình huống khẩn cấp.',
            'Bạn có thể xem lại các tình huống chưa chọn đúng.',
          ].map((t) => (
            <Row key={t}>
              <Icon name="check-circle" size={16} color={themeColors.successText} />
              <T size={12} style={{ flex: 1 }}>
                {t}
              </T>
            </Row>
          ))}
        </Card>
        <Gap />
        <Section title="Phần thưởng nhận được" />
        <Stats
          data={[
            { value: '+80 sao', label: 'Sao xếp hạng' },
            { value: '+20 mảnh', label: 'Tiến hóa mascot' },
          ]}
        />
        <Gap />
        <Section title="Tiến độ chuyên đề" />
        <Card>
          <Row between>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                <Icon
                  name={i <= 3 ? 'check-circle' : 'lock'}
                  color={i <= 3 ? themeColors.primary : palette.muted}
                />
                <T
                  bold={i === 3}
                  size={11}
                  style={{ color: i <= 3 ? themeColors.primary : palette.muted }}
                >
                  Bài {i}
                </T>
              </View>
            ))}
          </Row>
        </Card>
      </Screen>
    );
  const step = Number(id.replace('lesson-', '')) || 1;
  const goals = [
    'Nhận biết được những đồ vật và hành động có thể gây nguy cơ cháy nổ trong môi trường xung quanh.',
    'Phân biệt được những việc nên làm và không nên làm khi phát hiện đám cháy.',
    'Biết lựa chọn hành động phù hợp và an toàn khi gặp tình huống cháy.',
    'Kiểm tra và củng cố kiến thức về cách nhận biết nguy cơ và xử lý khi xảy ra cháy.',
  ];
  const instructions =
    step === 1
      ? ['Quan sát môi trường', 'Tìm những yếu tố có nguy cơ gây cháy nổ.']
      : step === 2
        ? ['Đọc từng hành động.', 'Chọn “Nên làm” hoặc “Không nên làm”.']
        : [
            'Xem tình huống',
            'Chọn hành động phù hợp',
            'Nhận phản hồi về lựa chọn của mình.',
            'Tiếp tục xử lý các tình huống phát sinh.',
          ];
  return (
    <Screen
      title={lessons[step - 1]}
      subtitle={`Bài ${step}`}
      onBack={() => back('skill-detail')}
      footer={
        <Button
          label={step === 4 ? 'Kiểm tra' : 'Bắt đầu học'}
          onPress={() => go(step >= 4 ? 'result' : (`lesson-${step + 1}` as ScreenId), { title })}
        />
      }
    >
      {step === 3 ? (
        <View style={{ gap: 14 }}>
          <ScenarioDialogueBox
            speaker="LifeLab Bạn đồng hành"
            dialogue="Khói qua khe cửa rồi... Mình nên làm gì bây giờ?"
            selectedIndex={quizChoice}
            onSelect={setQuizChoice}
            choices={[
              {
                text: 'Dùng khăn ướt bịt mũi miệng, cúi thấp người men theo tường thoát ra ngoài',
                correct: true,
              },
              {
                text: 'Mở toang cửa sổ và nhảy xuống đất ngay lập tức',
                correct: false,
              },
              {
                text: 'Trốn vào gầm giường hoặc tủ quần áo đóng kín',
                correct: false,
              },
            ]}
            explanation="Khói và khí độc bốc lên cao rất nguy hiểm. Dùng khăn ướt giúp lọc bớt khói và làm mát không khí, cúi thấp người sát sàn giúp hít thở không khí sạch hơn để thoát ra ngoài an toàn!"
          />
          <Gap size={8} />
        </View>
      ) : step === 4 ? (
        <Card style={{ borderStyle: 'dashed', backgroundColor: palette.light }}>
          <T center muted size={10}>
            TỔNG HỢP KIẾN THỨC PHÒNG CHÁY CHỮA CHÁY
          </T>
          <Gap />
          <View style={[S.grid, { justifyContent: 'center' }]}>
            {[
              ['Biển thoát hiểm', 'navigation'],
              ['Gọi trợ giúp', 'phone-call'],
              ['Bình chữa cháy', 'shield'],
              ['Lối thoát hiểm', 'log-out'],
              ['Đám cháy', 'wind'],
            ].map(([label, icon]) => (
              <Card key={label} style={{ width: '30%', padding: 10, alignItems: 'center', gap: 8 }}>
                <Icon name={icon} color={palette.strong} />
                <T center size={8}>
                  {label}
                </T>
              </Card>
            ))}
          </View>
        </Card>
      ) : (
        <SkillArtwork height={100} />
      )}
      <Gap size={23} />
      <Row>
        <Icon name="target" size={17} />
        <T bold>Mục tiêu</T>
      </Row>
      <Gap size={8} />
      <T muted size={13}>
        {goals[step - 1]}
      </T>
      <Gap size={20} />
      {step < 4 && (
        <>
          <Card style={{ gap: 14 }}>
            <T bold size={13}>
              Cách chơi
            </T>
            {instructions.map((text, i) => (
              <Row key={text}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <T size={11}>{i + 1}</T>
                </View>
                <T size={13} style={{ flex: 1 }}>
                  {text}
                </T>
              </Row>
            ))}
          </Card>
          <Gap />
          <T muted bold size={10}>
            Thông tin trò chơi
          </T>
          <Gap size={8} />
        </>
      )}
      <Card style={{ padding: 12 }}>
        <Row between>
          {[
            ['clock', step === 2 ? '1 phút' : '5 phút', 'Thời gian'],
            [
              'bar-chart-2',
              step === 4 ? '5–10 câu' : '●●○',
              step === 4 ? 'Số lượng' : 'Độ khó: Vừa',
            ],
            ['star', `${[12, 12, 20, 15][step - 1]} mảnh`, 'Phần thưởng'],
          ].map(([icon, value, label]) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <Icon name={icon} size={14} color={palette.strong} />
              <T bold size={10}>
                {value}
              </T>
              <T muted size={9}>
                {label}
              </T>
            </View>
          ))}
        </Row>
      </Card>
    </Screen>
  );
}
