import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {
  Avatar,
  Chips,
  Gap,
  IconButton,
  NotificationBanner,
  Placeholder,
  Row,
  Screen,
  Section,
  T,
} from '../components/ui';
import {
  CategoryGrid,
  MascotStageCard,
  NotificationRow,
  SuccessPillBanner,
  SuggestionsList,
  TaskCard,
} from '../components/content';
import { themeColors } from '../design-system/tokens';
import { tasks } from '../data/content';
import { ScreenId } from '../data/screens';
import { go } from '../navigation';
import { useDemo } from '../state/demo';

export function HomeScreen({ empty = false }: { empty?: boolean }) {
  const { name } = useDemo();
  const [mascot, setMascot] = useState(0);
  return (
    <Screen tabs="home">
      <Row between style={{ marginBottom: 20 }}>
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
          <Placeholder height={221} />
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
          <Section title="Nhiệm vụ của tôi" action="Xem tất cả" onPress={() => go('tasks')} />
          <TaskCard compact onPress={() => go('tasks')} />
          <Gap />
          <Row between style={{ alignItems: 'center', marginVertical: 4 }}>
            <IconButton
              name="chevron-left"
              label="Mascot trước"
              onPress={() => setMascot((mascot + 3) % 4)}
            />
            <View style={{ flex: 1, paddingHorizontal: 6 }}>
              <MascotStageCard
                category={['An toàn', 'Tự lập', 'Sức khỏe', 'Xã hội'][mascot]}
                stage={2}
                maxStage={3}
                currentExp={70}
                maxExp={100}
                onPress={() => go('mascot')}
              />
            </View>
            <IconButton
              name="chevron-right"
              label="Mascot tiếp theo"
              onPress={() => setMascot((mascot + 1) % 4)}
            />
          </Row>
          <Row style={{ justifyContent: 'center', gap: 6, marginTop: 4, marginBottom: 12 }}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  width: i === mascot ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === mascot ? themeColors.primary : themeColors.primaryLight,
                }}
              />
            ))}
          </Row>
          <Gap size={8} />
          <Section title="Gợi ý bài học" action="Xem tất cả" onPress={() => go('suggestions')} />
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
        <SuccessPillBanner
          message="Chúc mừng bạn đã hoàn thành An toàn điện"
          onPress={() => go('skill-detail', { title: 'An toàn điện' })}
        />
        <Gap size={8} />
        <NotificationBanner
          type="success"
          title="Nhiệm vụ hoàn thành"
          text="Bạn đã nhận được +80 Sao và +20 Mảnh Mascot!"
        />
        <NotificationBanner
          type="info"
          title="Bài học mới mở khóa"
          text="Bài 3: Xử lý tình huống đám cháy trong nhà đã sẵn sàng."
        />
        <NotificationBanner
          type="warning"
          title="Nhắc nhở học tập"
          text="Hãy duy trì chuỗi học tập 7 ngày để nhận thưởng tuần."
        />
        <Gap size={14} />
        <Section title="Cập nhật gần đây" />
        <NotificationRow
          initials="CR"
          title="Ronaldo đã thích bài viết của bạn"
          subtitle="Kỹ năng An toàn · 2 giờ trước"
          unread
          iconRight="heart"
        />
        <NotificationRow
          initials="CS"
          title="Costas đã nộp nhiệm vụ thực hành"
          subtitle="Lớp Kỹ năng sống 8A · 3 giờ trước"
          unread
        />
        <NotificationRow
          initials="JD"
          title="Jeremy đã nhắc đến bạn trong một thảo luận"
          subtitle="Phòng học số 2 · Hôm qua"
          unread={false}
        />
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
            suggestion
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
            suggestion={suggestions}
            onPress={() => go('skill-detail', { title: task.title })}
          />
        ))}
      </View>
    </Screen>
  );
}
