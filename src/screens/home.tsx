import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  Avatar,
  C,
  Chips,
  Gap,
  IconButton,
  MascotArt,
  Placeholder,
  Progress,
  Row,
  Screen,
  Section,
  T,
} from '../components/ui';
import { CategoryGrid, SuggestionsList, TaskCard } from '../components/content';
import { tasks } from '../data/content';
import { ScreenId } from '../data/screens';
import { go } from '../navigation';
import { useDemo } from '../state/demo';

export function HomeScreen({ empty = false }: { empty?: boolean }) {
  const { name } = useDemo();
  const [mascot, setMascot] = useState(0);
  return (
    <Screen tabs="home">
      <Row between style={{ marginBottom: 28 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mở hồ sơ"
          onPress={() => go('profile', {}, true)}
          style={{ flex: 1 }}
        >
          <Row>
            <Avatar size={38} />
            <View>
              <T bold size={16}>
                Xin chào {empty ? 'bạn' : name}
              </T>
              <T muted size={10}>
                Sẵn sàng học kỹ năng mới?
              </T>
            </View>
          </Row>
        </Pressable>
        <IconButton name="bell" label="Thông báo" onPress={() => go('notifications')} />
      </Row>
      {empty ? (
        <>
          <Placeholder height={230} style={{ marginHorizontal: 12, width: undefined }} />
          <Gap />
          <T center bold size={17}>
            Người bạn đồng hành đang chờ bạn
          </T>
          <Gap size={6} />
          <T center muted>
            Bắt đầu học để khám phá mascot của riêng mình.
          </T>
          <Gap size={24} />
          <Section title="Bắt đầu hành trình của bạn" />
          <CategoryGrid descriptions />
        </>
      ) : (
        <>
          <Section title="Nhiệm vụ của tôi" action="2 việc cần làm" onPress={() => go('tasks')} />
          <TaskCard compact onPress={() => go('tasks')} />
          <Gap />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem mascot"
            onPress={() => go('mascot')}
          >
            <T bold center size={19}>
              {
                ['Ngôi sao cô đơn', 'Ngôi sao an toàn', 'Ngôi sao tự lập', 'Ngôi sao sức khỏe'][
                  mascot
                ]
              }
            </T>
          </Pressable>
          <Gap size={16} />
          <Row between style={{ marginVertical: 10 }}>
            <IconButton
              name="chevron-left"
              label="Mascot trước"
              onPress={() => setMascot((mascot + 3) % 4)}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chi tiết mascot"
              onPress={() => go('mascot')}
            >
              <MascotArt size={225} />
            </Pressable>
            <IconButton
              name="chevron-right"
              label="Mascot tiếp theo"
              onPress={() => setMascot((mascot + 1) % 4)}
            />
          </Row>
          <View style={{ width: 200, alignSelf: 'center', marginVertical: 18 }}>
            <Progress value={34 + mascot * 12} height={10} />
          </View>
          <Gap />
          <Section title="Gợi ý" action="Xem tất cả" onPress={() => go('suggestions')} />
          <SuggestionsList />
        </>
      )}
    </Screen>
  );
}
export function HomeDetailScreen({ id }: { id: ScreenId }) {
  const [filter, setFilter] = useState('Tất cả');
  if (id === 'home-empty') return <HomeScreen empty />;
  if (id === 'notifications')
    return (
      <Screen title="Thông báo">
        <Gap />
        <View style={{ gap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <Pressable
              key={i}
              accessibilityRole="button"
              onPress={() => go('skill-detail', { title: 'An toàn điện' })}
              style={{ padding: 18, borderRadius: 15, backgroundColor: C.fill }}
            >
              <T size={13}>Chúc mừng bạn đã hoàn thành An toàn điện</T>
            </Pressable>
          ))}
        </View>
      </Screen>
    );
  const suggestions = id === 'suggestions';
  const visible = tasks.filter(
    (task) =>
      filter === 'Tất cả' ||
      (suggestions
        ? task.category === filter
        : task.status === filter || (filter === 'Đã hoàn thành' && task.progress === 100)),
  );
  return (
    <Screen
      title={suggestions ? 'Gợi ý' : 'Danh sách nhiệm vụ'}
      right={
        suggestions ? (
          <IconButton name="search" label="Tìm kỹ năng" onPress={() => go('skills', {}, true)} />
        ) : undefined
      }
    >
      <Chips
        options={
          suggestions
            ? ['Tất cả', 'Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội']
            : ['Tất cả', 'Đã hoàn thành', 'Đang làm', 'Chưa làm']
        }
        value={filter}
        onChange={setFilter}
      />
      <View style={{ gap: 12 }}>
        {suggestions && (filter === 'Tất cả' || filter === 'Sức khỏe') && (
          <TaskCard
            task={{
              ...tasks[1],
              title: 'Sơ cứu vết trầy xước',
              category: 'Sức khỏe',
            }}
            onPress={() => go('skill-detail', { title: 'Sơ cứu vết trầy xước' })}
          />
        )}
        {visible.map((task) => (
          <TaskCard
            key={task.title}
            task={task}
            onPress={() => go('skill-detail', { title: task.title })}
          />
        ))}
      </View>
    </Screen>
  );
}
