import { Pressable, View } from 'react-native';
import { categories, tasks } from '../data/content';
import { go } from '../navigation';
import { Avatar, Badge, Button, C, Card, Gap, Icon, Progress, Row, S, T } from './ui';

export function CategoryGrid({ descriptions = false }: { descriptions?: boolean }) {
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
              <Icon name={cat.icon} color="#888" />
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
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={name}
      onPress={onPress}
      style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
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
  return (
    <View style={{ gap: 8 }}>
      {[
        ['Nhận biết nguy cơ cháy', 'An toàn · 5 phút', 'wind'],
        ['Tự chuẩn bị bữa sáng', 'Tự lập · 5 phút', 'coffee'],
        ['Lắng nghe để hiểu bạn', 'Xã hội · 4 phút', 'message-circle'],
      ].map(([title, description, icon]) => (
        <Card key={title} style={{ padding: 10 }} onPress={() => go('skill-detail', { title })}>
          <Row>
            <View style={{ backgroundColor: '#eee', padding: 12, borderRadius: 6 }}>
              <Icon name={icon} color="#888" />
            </View>
            <View style={{ flex: 1 }}>
              <T bold size={12}>
                {title}
              </T>
              <T muted size={11}>
                {description}
              </T>
            </View>
            <Icon name="chevron-right" size={16} color="#888" />
          </Row>
        </Card>
      ))}
    </View>
  );
}
export function RankingContent() {
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
            <Icon name="award" color="#999" size={18} />
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
          style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' }}
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
      <Card style={{ backgroundColor: '#f3f3f3', padding: 12 }}>
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
