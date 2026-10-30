import { Pressable, View } from 'react-native';
import { categories, tasks } from '../data/content';
import { go } from '../navigation';
import { useDesign, usePalette } from '../design-system/theme';
import { colors, radius, themeColors } from '../design-system/tokens';
import { Avatar, Badge, Button, C, Card, Gap, Icon, Progress, Row, S, T } from './ui';

export function CategoryGrid({ descriptions = false }: { descriptions?: boolean }) {
  const design = useDesign();
  const palette = usePalette();
  if (design)
    return (
      <View style={[S.grid, { gap: 12 }]}>
        {categories.map((cat) => (
          <Card
            key={cat.name}
            label={cat.name}
            onPress={() => go('skill-category', { category: cat.name })}
            style={{ width: '47%', flexGrow: 1, minHeight: 86, padding: 12, gap: 8 }}
          >
            <Row style={{ gap: 8 }}>
              <View style={{ padding: 6, borderRadius: 20, backgroundColor: colors.primary[200] }}>
                <Icon name={cat.icon} size={18} color={colors.primary[600]} />
              </View>
              <T bold style={{ flex: 1 }} size={14}>
                {cat.name}
              </T>
              <Icon name="chevron-right" size={14} color={colors.primary[600]} />
            </Row>
            <T muted size={12}>
              {descriptions ? cat.description : `${cat.count} kỹ năng`}
            </T>
          </Card>
        ))}
      </View>
    );
  return (
    <View style={S.grid}>
      {categories.map((cat) => (
        <Card
          key={cat.name}
          onPress={() => go('skill-category', { category: cat.name })}
          label={cat.name}
          style={{
            width: '48%',
            flexGrow: 1,
            gap: 10,
            backgroundColor: descriptions ? '#fff' : '#fafafa',
          }}
        >
          <Row between>
            <View style={{ padding: 8, borderRadius: 8, backgroundColor: '#eee' }}>
              <Icon name={cat.icon} color={palette.muted} />
            </View>
            {!descriptions && <Icon name="chevron-right" size={14} color="#999" />}
          </Row>
          <View>
            <T bold>{cat.name}</T>
            <T size={11} muted>
              {descriptions ? cat.description : `${cat.count} kỹ năng`}
            </T>
          </View>
          {!descriptions && <Progress value={(cat.done / cat.count) * 100} height={4} />}
        </Card>
      ))}
    </View>
  );
}
export function TaskCard({
  task = tasks[0],
  onPress,
  compact = false,
  suggestion = false,
}: {
  task?: (typeof tasks)[number];
  onPress?: () => void;
  compact?: boolean;
  suggestion?: boolean;
}) {
  const done = task.progress === 100;
  const inProgress = task.progress > 0 && !done;
  const design = useDesign();
  if (!design) return <WireframeTaskCard task={task} compact={compact} onPress={onPress} />;
  const open = onPress ?? (() => go('skill-detail', { title: task.title }));

  const statusText = done ? '✓ Hoàn thành' : inProgress ? '• Đang học' : '• Chưa học';
  const statusColor = done ? '#16A34A' : inProgress ? colors.primary[700] : colors.neutral[500];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={task.title}
      onPress={open}
      style={({ pressed }) => [
        {
          backgroundColor: '#FFFFFF',
          borderWidth: 1.5,
          borderColor: colors.primary[300],
          borderRadius: radius.card,
          padding: 16,
          gap: 8,
          shadowColor: '#0F63A9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        },
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
      ]}
    >
      <Row between style={{ alignItems: 'center' }}>
        <Badge>{task.category}</Badge>
        <T size={12} bold style={{ color: statusColor }}>
          {statusText}
        </T>
      </Row>

      <T bold size={16} style={{ color: colors.primary[900] }}>
        {task.title}
      </T>

      <T size={13} style={{ color: colors.neutral[500] }}>
        {task.className}
      </T>

      {inProgress && (
        <View style={{ marginVertical: 4 }}>
          <Row between style={{ marginBottom: 4 }}>
            <T size={13} style={{ color: colors.neutral[500] }}>
              Tiến độ
            </T>
            <T bold size={13} style={{ color: colors.primary[700] }}>
              {task.progress}%
            </T>
          </Row>
          <View
            style={{
              height: 6,
              backgroundColor: colors.primary[200],
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${task.progress}%`,
                height: '100%',
                backgroundColor: colors.primary[700],
                borderRadius: 3,
              }}
            />
          </View>
        </View>
      )}

      <Row between style={{ alignItems: 'center', marginTop: inProgress ? 4 : 8 }}>
        <Row style={{ gap: 6, alignItems: 'center' }}>
          <Icon name="calendar" size={14} color={colors.neutral[600]} />
          <T size={12} style={{ color: colors.neutral[600] }}>
            {done ? `Hoàn thành: ${task.due}` : `Hạn: ${task.due}`}
          </T>
        </Row>
        <View
          style={{
            minHeight: 32,
            paddingHorizontal: 16,
            borderRadius: radius.buttonSmall,
            backgroundColor: inProgress ? colors.primary[600] : '#FFFFFF',
            borderWidth: 1.5,
            borderColor: inProgress ? colors.primary[500] : colors.primary[700],
            borderBottomWidth: 2.5,
            borderBottomColor: inProgress ? colors.primary[800] : colors.primary[700],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T
            bold
            size={12}
            style={{
              color: inProgress ? '#FFFFFF' : colors.primary[700],
              textAlign: 'center',
            }}
          >
            {done ? 'Xem lại' : inProgress ? 'Tiếp tục' : 'Bắt đầu'}
          </T>
        </View>
      </Row>
    </Pressable>
  );
}

function WireframeTaskCard({
  task = tasks[0],
  onPress,
  compact = false,
}: {
  task?: (typeof tasks)[number];
  onPress?: () => void;
  compact?: boolean;
}) {
  const done = task.progress === 100;
  return (
    <Card
      style={{
        gap: compact ? 8 : 10,
        padding: compact ? 14 : 16,
        borderColor: task.progress > 0 && !done ? '#404040' : C.line,
        backgroundColor: done ? '#dedede' : '#fff',
      }}
      onPress={onPress}
      label={task.title}
    >
      {compact ? (
        <Row between>
          <T bold size={13} style={{ flex: 1 }}>
            {task.title}
          </T>
          <Badge>{task.category.toUpperCase()}</Badge>
        </Row>
      ) : (
        <>
          <Row between>
            <Badge>{task.category.toUpperCase()}</Badge>
            {!compact && (
              <T size={10} muted={done}>
                {done ? '✓ ' : '• '}
                {task.status}
              </T>
            )}
          </Row>
          <T bold size={16}>
            {task.title}
          </T>
        </>
      )}
      <T muted size={12}>
        {task.className}
      </T>
      {task.progress > 0 && <Progress value={task.progress} label="Tiến độ" />}
      <Row between>
        <Row style={{ gap: 4 }}>
          <Icon name="clock" size={13} color="#888" />
          <T muted size={11}>
            Hạn: {task.due}
          </T>
        </Row>
        <Button
          small
          variant={compact || (task.progress > 0 && !done) ? 'primary' : 'outline'}
          label={done ? 'Xem lại' : task.progress ? 'Tiếp tục' : 'Bắt đầu'}
          onPress={onPress ?? (() => go('skill-detail'))}
        />
      </Row>
    </Card>
  );
}
export function SkillCard({
  title,
  description,
  progress = 0,
  onPress,
}: {
  title: string;
  description: string;
  progress?: number;
  onPress: () => void;
}) {
  return (
    <Card label={title} onPress={onPress} style={{ padding: 14, gap: 8 }}>
      <Row>
        <View style={{ flex: 1 }}>
          <T size={14}>{title}</T>
          <T muted size={11}>
            {description}
          </T>
        </View>
        <Icon name="chevron-right" size={16} color={colors.primary[600]} />
      </Row>
      <Row style={{ gap: 10 }}>
        <View style={{ width: 90 }}>
          <Progress value={progress} height={4} />
        </View>
        <T size={10} style={{ color: colors.primary[800] }}>
          {progress}%
        </T>
        <Badge>{progress === 100 ? 'Hoàn thành' : progress ? 'Đang học' : 'Chưa học'}</Badge>
      </Row>
    </Card>
  );
}
export function ClassCard({
  name,
  role = 'owner',
  onPress,
}: {
  name: string;
  role?: 'owner' | 'member';
  onPress?: () => void;
}) {
  return (
    <Card onPress={onPress} label={name} style={{ padding: 8 }}>
      <Row style={{ gap: 10 }}>
        <View
          style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: colors.neutral[200] }}
        />
        <View style={{ flex: 1, gap: 6 }}>
          <T size={14}>{name}</T>
          <Row between style={{ alignItems: 'flex-end', gap: 4 }}>
            <View style={{ gap: 2 }}>
              <Row style={{ gap: 4 }}>
                <Icon name="users" size={12} />
                <T muted size={10}>
                  32 thành viên
                </T>
              </Row>
              <Row style={{ gap: 4 }}>
                <Icon name="clipboard" size={12} />
                <T muted size={10}>
                  5 nhiệm vụ
                </T>
              </Row>
            </View>
            <Badge>{role === 'owner' ? 'Lớp của tôi' : 'Đã tham gia'}</Badge>
          </Row>
        </View>
        {onPress && <Icon name="chevron-right" color={colors.primary[600]} size={16} />}
      </Row>
    </Card>
  );
}

export function MemberRow({
  name,
  progress,
  onPress,
  subtitle = 'Học viên',
}: {
  name: string;
  progress?: number;
  onPress?: () => void;
  subtitle?: string;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={name}
      onPress={onPress}
      style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: palette.line }}
    >
      <Row>
        <Avatar name={name} size={38} />
        <View style={{ flex: 1 }}>
          <T bold size={12}>
            {name}
          </T>
          <T size={10} muted>
            {subtitle}
          </T>
        </View>
        {progress !== undefined && (
          <View style={{ width: 108 }}>
            <Row>
              <Progress value={progress} height={4} />
              <T size={10} muted>
                {progress}%
              </T>
            </Row>
          </View>
        )}
      </Row>
    </Pressable>
  );
}
export function SuggestionsList() {
  const suggestions = [
    { title: 'Nhận biết nguy cơ cháy', category: 'An toàn', duration: '3 phút' },
  ];
  return (
    <View style={{ gap: 12 }}>
      {suggestions.map((item) => (
        <Pressable
          key={item.title}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => go('skill-detail', { title: item.title })}
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 1.5,
            borderColor: '#1989E2',
            borderRadius: 16,
            padding: 16,
            gap: 8,
          }}
        >
          <Row between style={{ alignItems: 'center' }}>
            <T bold size={16} style={{ color: '#03355F' }}>
              {item.title}
            </T>
            <Icon name="chevron-right" size={20} color="#1989E2" />
          </Row>
          <Row style={{ alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Badge>{item.category}</Badge>
            <T size={13} style={{ color: '#6B7280' }}>
              {item.duration}
            </T>
          </Row>
        </Pressable>
      ))}
    </View>
  );
}
export function RankingContent() {
  const palette = usePalette();
  return (
    <>
      <Row style={{ justifyContent: 'space-evenly', alignItems: 'flex-end', paddingVertical: 32 }}>
        {[
          ['Tuấn', '1.100', 2],
          ['Hà', '1.250', 1],
          ['Mai', '980', 3],
        ].map(([name, score, rank]) => (
          <View key={name} style={{ alignItems: 'center', gap: 7 }}>
            <Avatar size={rank === 1 ? 76 : 58} />
            <Badge dark={rank === 1}>{rank}</Badge>
            <T bold>{name}</T>
            <T muted size={12}>
              {score} sao
            </T>
            <Icon name="award" color={palette.muted} size={18} />
          </View>
        ))}
      </Row>
      {[
        ['Minh', '820'],
        ['Lan', '790'],
        ['An', '760'],
        ['Phúc', '740'],
      ].map(([name, score], i) => (
        <Row
          key={name}
          style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.line }}
        >
          <T muted style={{ width: 18 }}>
            {i + 4}
          </T>
          <Avatar size={32} />
          <T style={{ flex: 1 }}>{name}</T>
          <T bold size={12}>
            {score} sao
          </T>
        </Row>
      ))}
      <Gap />
      <Card style={{ backgroundColor: palette.light, padding: 12 }}>
        <Row>
          <T bold>8</T>
          <Avatar size={32} />
          <View style={{ flex: 1 }}>
            <T bold>Bạn</T>
            <T muted size={10}>
              Vị trí của bạn
            </T>
          </View>
          <T bold size={12}>
            720 sao
          </T>
        </Row>
      </Card>
    </>
  );
}

export function MascotStageCard({
  category = 'An toàn',
  stage = 2,
  maxStage = 3,
  currentExp = 70,
  maxExp = 100,
  onPress,
}: {
  category?: string;
  stage?: number;
  maxStage?: number;
  currentExp?: number;
  maxExp?: number;
  onPress?: () => void;
}) {
  const palette = usePalette();
  const design = useDesign();
  return (
    <Card
      onPress={onPress}
      label={`Mascot ${category}`}
      style={{
        padding: 16,
        gap: 12,
        backgroundColor: design ? themeColors.surface : palette.cardBg,
        borderColor: palette.line,
        borderWidth: 1,
      }}
    >
      <Row between>
        <Badge>{`Giai đoạn ${stage}/${maxStage}`}</Badge>
        <T bold size={12} style={{ color: themeColors.primary }}>
          {category}
        </T>
      </Row>
      <View
        style={{
          height: 140,
          borderRadius: 12,
          backgroundColor: design ? themeColors.primaryLight : palette.light,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Icon name="smile" size={48} color={themeColors.primary} />
        <T bold size={15} style={{ color: themeColors.primaryDark }}>
          Mascot đồng hành
        </T>
      </View>
      <View style={{ gap: 6 }}>
        <Row between>
          <T muted size={11}>
            Tiến độ tiến hóa
          </T>
          <T bold size={11} style={{ color: themeColors.primaryNavy }}>
            {currentExp} / {maxExp} mảnh
          </T>
        </Row>
        <Progress value={(currentExp / maxExp) * 100} height={8} />
        <T muted center size={10}>
          Hoàn thành bài tập để nhận mảnh ghép nâng cấp
        </T>
      </View>
    </Card>
  );
}

export function StreakWeekBadge({
  streakDays = 7,
  days = [
    { day: 'T2', active: true },
    { day: 'T3', active: true },
    { day: 'T4', active: true },
    { day: 'T5', active: true },
    { day: 'T6', active: true },
    { day: 'T7', active: true },
    { day: 'CN', active: true, today: true },
  ],
}: {
  streakDays?: number;
  days?: { day: string; active: boolean; today?: boolean }[];
}) {
  const palette = usePalette();
  return (
    <Card
      style={{
        padding: 16,
        gap: 12,
        backgroundColor: palette.cardBg,
        borderColor: themeColors.fireSoft,
        borderWidth: 1,
      }}
    >
      <Row between>
        <Row style={{ gap: 8 }}>
          <View
            style={{
              padding: 6,
              borderRadius: 16,
              backgroundColor: themeColors.fireSoft,
            }}
          >
            <Icon name="zap" size={18} color={themeColors.fireOrange} />
          </View>
          <View>
            <T bold size={15}>
              {streakDays} ngày học liên tiếp!
            </T>
            <T muted size={11}>
              Duy trì thói quen học tập mỗi ngày
            </T>
          </View>
        </Row>
      </Row>
      <Row between style={{ marginTop: 4 }}>
        {days.map((item, idx) => (
          <View key={idx} style={{ alignItems: 'center', gap: 6 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: item.active
                  ? themeColors.fireSoft
                  : palette.light,
                borderWidth: item.today ? 2 : 1,
                borderColor: item.today
                  ? themeColors.fireOrange
                  : item.active
                    ? themeColors.fireSoft
                    : palette.line,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                name={item.active ? 'zap' : 'circle'}
                size={14}
                color={item.active ? themeColors.fireOrange : palette.muted}
              />
            </View>
            <T bold={item.today} muted={!item.today} size={11}>
              {item.day}
            </T>
          </View>
        ))}
      </Row>
    </Card>
  );
}

export function StarScoreBanner({
  score = 85,
  maxScore = 100,
  stars = 80,
  shards = 20,
  lessonTitle = 'Bài 3: Xử lý tình huống',
}: {
  score?: number;
  maxScore?: number;
  stars?: number;
  shards?: number;
  lessonTitle?: string;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 10, marginVertical: 12 }}>
      <T center size={15} muted>
        Điểm số của bạn
      </T>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: themeColors.primaryLight,
          borderWidth: 3,
          borderColor: themeColors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <T bold size={34} style={{ color: themeColors.primary }}>
          {score}
        </T>
        <T size={11} muted>
          /{maxScore}
        </T>
      </View>
      <T bold size={13} style={{ color: themeColors.successText }}>
        ♧ Điểm tốt nhất: {score}/{maxScore}
      </T>
      <T muted size={12}>
        Bạn đã hoàn thành {lessonTitle}
      </T>
      <Row style={{ gap: 10, marginTop: 6 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            backgroundColor: themeColors.starSoft,
            borderWidth: 1,
            borderColor: '#F0D59D',
          }}
        >
          <Icon name="star" size={16} color={themeColors.starGold} />
          <T bold size={13} style={{ color: themeColors.starText }}>
            +{stars} Sao BXH
          </T>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            backgroundColor: themeColors.primaryLight,
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <Icon name="gift" size={16} color={themeColors.primary} />
          <T bold size={13} style={{ color: themeColors.primaryNavy }}>
            +{shards} Mảnh Mascot
          </T>
        </View>
      </Row>
    </View>
  );
}

export function ScenarioDialogueBox({
  speaker = 'LifeLab',
  dialogue = 'Khói qua khe cửa rồi... Mình nên làm gì bây giờ?',
  choices,
  onSelect,
  selectedIndex,
  explanation,
}: {
  speaker?: string;
  dialogue: string;
  choices: { text: string; correct: boolean }[];
  onSelect?: (index: number) => void;
  selectedIndex?: number | null;
  explanation?: string;
}) {
  const palette = usePalette();
  return (
    <View style={{ gap: 14 }}>
      {/* Speech bubble */}
      <View
        style={{
          padding: 16,
          borderRadius: 16,
          backgroundColor: themeColors.primaryLight,
          borderWidth: 1,
          borderColor: themeColors.border,
          position: 'relative',
        }}
      >
        <Row style={{ gap: 8, marginBottom: 6 }}>
          <View
            style={{
              padding: 4,
              borderRadius: 12,
              backgroundColor: themeColors.surface,
            }}
          >
            <Icon name="message-circle" size={16} color={themeColors.primary} />
          </View>
          <T bold size={13} style={{ color: themeColors.primaryDark }}>
            {speaker}
          </T>
        </Row>
        <T bold size={16} style={{ color: themeColors.primaryDark, lineHeight: 22 }}>
          {dialogue}
        </T>
      </View>

      {/* Choices list */}
      <View style={{ gap: 10 }}>
        {choices.map((choice, i) => {
          const isSelected = selectedIndex === i;
          let bg = palette.cardBg;
          let border = palette.line;
          let textColor = palette.ink;

          if (isSelected) {
            if (choice.correct) {
              bg = themeColors.successGreen;
              border = themeColors.successText;
              textColor = themeColors.successText;
            } else {
              bg = themeColors.errorSoft;
              border = themeColors.errorRed;
              textColor = themeColors.errorRed;
            }
          }

          return (
            <Card
              key={i}
              onPress={() => onSelect?.(i)}
              label={choice.text}
              style={{
                padding: 14,
                backgroundColor: bg,
                borderColor: border,
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              <Row style={{ gap: 10 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 1,
                    borderColor: border,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected
                      ? choice.correct
                        ? themeColors.successText
                        : themeColors.errorRed
                      : themeColors.surface,
                  }}
                >
                  <T
                    bold
                    size={12}
                    style={{
                      color: isSelected ? themeColors.surface : palette.muted,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </T>
                </View>
                <T bold={isSelected} size={14} style={{ flex: 1, color: textColor }}>
                  {choice.text}
                </T>
                {isSelected && (
                  <Icon
                    name={choice.correct ? 'check-circle' : 'alert-circle'}
                    size={18}
                    color={choice.correct ? themeColors.successText : themeColors.errorRed}
                  />
                )}
              </Row>
            </Card>
          );
        })}
      </View>

      {/* Explanation when selected */}
      {selectedIndex != null && explanation && (
        <Card
          style={{
            padding: 12,
            backgroundColor: themeColors.primarySoft,
            borderColor: themeColors.primaryLight,
            gap: 6,
          }}
        >
          <Row style={{ gap: 6 }}>
            <Icon name="info" size={16} color={themeColors.primary} />
            <T bold size={13} style={{ color: themeColors.primary }}>
              Giải thích kiến thức
            </T>
          </Row>
          <T size={12} style={{ color: themeColors.textSecondary, lineHeight: 18 }}>
            {explanation}
          </T>
        </Card>
      )}
    </View>
  );
}

export type LessonStatus = 'completed' | 'in_progress' | 'locked';

export function LessonItem({
  index = 1,
  title = 'Nhận biết',
  status = 'in_progress',
  subtitle,
  onPress,
}: {
  index?: number;
  title: string;
  status?: LessonStatus | 'Đã hoàn thành' | 'Đang học' | 'Chưa mở khoá';
  subtitle?: string;
  onPress?: () => void;
}) {
  const normalizedStatus: LessonStatus =
    status === 'completed' || status === 'Đã hoàn thành'
      ? 'completed'
      : status === 'in_progress' || status === 'Đang học'
        ? 'in_progress'
        : 'locked';

  const statusLabel =
    subtitle ??
    (normalizedStatus === 'completed'
      ? 'Đã hoàn thành'
      : normalizedStatus === 'in_progress'
        ? 'Đang học'
        : 'Chưa mở khoá');

  const isLocked = normalizedStatus === 'locked';

  return (
    <Card
      onPress={isLocked ? undefined : onPress}
      label={`${title} - ${statusLabel}`}
      style={{
        padding: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor:
          normalizedStatus === 'locked' ? colors.neutral[300] : colors.primary[700],
        backgroundColor:
          normalizedStatus === 'in_progress' ? colors.primary[200] : '#FFFFFF',
        opacity: isLocked ? 0.75 : 1,
        shadowColor: '#0F63A9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Row style={{ gap: 12 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor:
              normalizedStatus === 'locked' ? colors.neutral[300] : colors.primary[700],
            backgroundColor:
              normalizedStatus === 'in_progress' ? '#FFFFFF' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T
            bold
            size={13}
            style={{
              color:
                normalizedStatus === 'locked' ? colors.neutral[400] : colors.primary[700],
            }}
          >
            {index}
          </T>
        </View>

        <View style={{ flex: 1, gap: 2 }}>
          <T
            bold
            size={14}
            style={{
              color:
                normalizedStatus === 'locked' ? colors.neutral[500] : colors.primary[900],
            }}
          >
            {title}
          </T>
          <T
            size={11}
            style={{
              color:
                normalizedStatus === 'in_progress'
                  ? colors.primary[700]
                  : colors.neutral[500],
            }}
          >
            {statusLabel}
          </T>
        </View>

        <View style={{ width: 28, alignItems: 'center', justifyContent: 'center' }}>
          {normalizedStatus === 'completed' ? (
            <Icon name="check" size={18} color={colors.primary[700]} />
          ) : normalizedStatus === 'in_progress' ? (
            <Icon name="play" size={18} color={colors.primary[700]} />
          ) : (
            <Icon name="lock" size={16} color={colors.neutral[400]} />
          )}
        </View>
      </Row>
    </Card>
  );
}

export function ItemDetailCard({
  title = 'Ba lô cắm trại',
  category = 'Tự lập',
  description = 'Mở khóa khi hoàn thành kỹ năng An toàn.',
  status = 'unlocked',
  buttonLabel,
  onAction,
}: {
  title?: string;
  category?: string;
  description?: string;
  status?: 'equipped' | 'unlocked' | 'locked';
  buttonLabel?: string;
  onAction?: () => void;
}) {
  const isEquipped = status === 'equipped';
  const isUnlocked = status === 'unlocked' || isEquipped;

  const resolvedButtonLabel =
    buttonLabel ?? (isEquipped ? 'Đang sử dụng' : isUnlocked ? 'Trang bị' : 'Xem kỹ năng');

  return (
    <Card
      style={{
        padding: 14,
        borderRadius: radius.card,
        borderWidth: 1.5,
        borderColor: isEquipped ? colors.primary[700] : colors.primary[300],
        gap: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#0F63A9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View
        style={{
          height: 120,
          borderRadius: 12,
          backgroundColor: isUnlocked ? colors.primary[200] : colors.neutral[200],
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name="briefcase"
          size={44}
          color={isUnlocked ? colors.primary[700] : colors.neutral[400]}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Row between>
          <T bold size={16} style={{ color: colors.primary[900] }}>
            {title}
          </T>
          <Badge>{isEquipped ? 'Đang sử dụng' : isUnlocked ? 'Đã mở khoá' : 'Chưa mở khoá'}</Badge>
        </Row>
        <Row style={{ gap: 6, marginVertical: 2 }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 4,
              backgroundColor: colors.primary[200],
            }}
          >
            <T size={10} bold style={{ color: colors.primary[800] }}>
              {category}
            </T>
          </View>
        </Row>
        <T muted size={11} style={{ lineHeight: 16 }}>
          {description}
        </T>
      </View>

      <Button
        small
        variant={isEquipped ? 'primary' : 'outline'}
        label={resolvedButtonLabel}
        onPress={onAction ?? (() => {})}
        disabled={!isUnlocked && !onAction}
      />
    </Card>
  );
}

export function MascotEvolutionRow({
  currentStage = 2,
  onSelectStage,
}: {
  currentStage?: number;
  onSelectStage?: (stage: number) => void;
}) {
  const palette = usePalette();
  const stages = [
    {
      stage: 1,
      title: 'Giai đoạn 1',
      shards: '8 mảnh',
      note: 'Trạng thái ban đầu',
      badge: 'Đã mở khoá',
      active: currentStage >= 1,
      isCurrent: currentStage === 1,
    },
    {
      stage: 2,
      title: 'Giai đoạn 2',
      shards: '50 mảnh',
      note: 'Đã thu thập',
      badge: currentStage === 2 ? 'Hiện tại' : 'Đã mở khoá',
      active: currentStage >= 2,
      isCurrent: currentStage === 2,
    },
    {
      stage: 3,
      title: 'Giai đoạn 3',
      shards: '100 mảnh',
      note: 'Cần thêm 50 mảnh',
      badge: currentStage >= 3 ? 'Hiện tại' : 'Chưa mở khoá',
      active: currentStage >= 3,
      isCurrent: currentStage === 3,
    },
  ];

  return (
    <Row style={{ gap: 8 }}>
      {stages.map((st) => (
        <Card
          key={st.stage}
          label={`${st.title}: ${st.shards}`}
          onPress={onSelectStage ? () => onSelectStage(st.stage) : undefined}
          style={{
            flex: 1,
            padding: 8,
            gap: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: st.isCurrent ? themeColors.primary : palette.line,
            backgroundColor: st.isCurrent ? themeColors.primarySoft : palette.cardBg,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 64,
              borderRadius: 6,
              backgroundColor: st.active ? themeColors.primaryLight : colors.neutral[200],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="smile"
              size={24}
              color={st.active ? themeColors.primary : colors.neutral[400]}
            />
          </View>
          <T bold size={11} center style={{ color: palette.ink }}>
            {st.title}
          </T>
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 12,
              backgroundColor: st.isCurrent ? themeColors.primary : themeColors.primaryLight,
            }}
          >
            <T
              size={9}
              bold
              style={{
                color: st.isCurrent ? '#fff' : themeColors.primaryNavy,
              }}
            >
              {st.badge}
            </T>
          </View>
          <T bold size={10} style={{ color: themeColors.primaryNavy }}>
            {st.shards}
          </T>
          <T muted size={9} center>
            {st.note}
          </T>
        </Card>
      ))}
    </Row>
  );
}

export function LearnResultItem({
  text = 'Học được các kỹ năng thoát hiểm',
}: {
  text: string;
}) {
  return (
    <Row style={{ gap: 8, paddingVertical: 4 }}>
      <Icon name="check" size={16} color={themeColors.successText} />
      <T size={13} style={{ flex: 1, color: themeColors.textPrimary }}>
        {text}
      </T>
    </Row>
  );
}

export function StarRewardBadge({
  stars = 8,
}: {
  stars?: number;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: themeColors.border,
        backgroundColor: themeColors.primaryLight,
        gap: 4,
      }}
    >
      <Icon name="star" size={20} color={themeColors.starGold} />
      <T bold size={11} style={{ color: themeColors.primaryNavy }}>
        +{stars} sao
      </T>
    </View>
  );
}

export function SuccessPillBanner({
  message = 'Chúc mừng bạn đã hoàn thành An toàn điện',
  onPress,
}: {
  message?: string;
  onPress?: () => void;
}) {
  const palette = usePalette();
  const content = (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: colors.neutral[200],
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 6,
      }}
    >
      <T bold size={12} style={{ color: palette.ink }}>
        {message}
      </T>
    </View>
  );
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return content;
}

export function NotificationRow({
  initials = 'CR',
  title = 'Ronaldo Liked your posted',
  subtitle = 'Favourites Places - 2h ago',
  unread = true,
  avatarColor,
  iconRight,
  onPress,
}: {
  initials?: string;
  title: string;
  subtitle: string;
  unread?: boolean;
  avatarColor?: string;
  iconRight?: string;
  onPress?: () => void;
}) {
  const palette = usePalette();
  const content = (
    <Row
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: palette.line,
        gap: 12,
      }}
    >
      <View style={{ position: 'relative' }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: avatarColor ?? themeColors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <T bold size={13} style={{ color: themeColors.primaryDark }}>
            {initials}
          </T>
        </View>
        {unread && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: themeColors.primary,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <T bold size={13} style={{ color: palette.ink }}>
          {title}
        </T>
        <T muted size={11}>
          {subtitle}
        </T>
      </View>
      {iconRight && (
        <View style={{ padding: 6 }}>
          <Icon name={iconRight} size={16} color={palette.muted} />
        </View>
      )}
    </Row>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        {content}
      </Pressable>
    );
  }
  return content;
}

