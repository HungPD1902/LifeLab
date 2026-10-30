import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chips,
  Dialog,
  Field,
  Gap,
  Icon,
  IconButton,
  MenuRow,
  MenuGroup,
  Notice,
  Placeholder,
  Progress,
  Row,
  Screen,
  Section,
  TabSegments,
  S,
  Stats,
  T,
  TextButton,
} from '../components/ui';
import {
  ItemDetailCard,
  MascotEvolutionRow,
  RankingContent,
  StreakWeekBadge,
} from '../components/content';
import { categories, items } from '../data/content';
import type { ScreenId } from '../data/screens';
import { back, go } from '../navigation';
import { useDemo } from '../state/demo';
import { usePalette } from '../design-system/theme';
import { colors, themeColors } from '../design-system/tokens';

export function ProfileScreen() {
  const { name } = useDemo();
  return (
    <Screen tabs="profile">
      <Gap size={32} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Chỉnh sửa hồ sơ"
        onPress={() => go('profile-edit')}
        style={{ alignItems: 'center', gap: 12 }}
      >
        <Avatar size={80} />
        <Row style={{ gap: 6 }}>
          <T size={20}>{name}</T>
          <Icon name="edit-3" size={18} color={colors.primary[600]} />
        </Row>
      </Pressable>
      <Gap size={36} />
      <Section title="Thành tích học tập" />
      <Card style={{ padding: 16 }}>
        <Row between>
          {[
            { icon: 'star', value: '245', label: 'Sao', target: 'ranking' },
            { icon: 'zap', value: '7 ngày', label: 'Học liên tiếp', target: 'streak' },
            { icon: 'book-open', value: '8/12', label: 'Kỹ năng', target: 'skills' },
          ].map((stat) => (
            <Pressable
              key={stat.label}
              accessibilityRole="button"
              accessibilityLabel={stat.label}
              onPress={() => go(stat.target as ScreenId)}
              style={{ flex: 1, alignItems: 'center', gap: 8 }}
            >
              <Icon name={stat.icon} color={colors.primary[600]} />
              <T size={20}>{stat.value}</T>
              <T muted size={10}>
                {stat.label}
              </T>
            </Pressable>
          ))}
        </Row>
      </Card>
      <Gap size={16} />
      <MenuGroup>
        <MenuRow icon="home" label="Mascot của tôi" onPress={() => go('mascot')} />
        <MenuRow icon="bar-chart-2" label="Bảng xếp hạng" onPress={() => go('ranking')} />
        <MenuRow icon="gift" label="Bộ sưu tập" onPress={() => go('collection')} />
        <MenuRow icon="zap" label="Chuỗi ngày học" onPress={() => go('streak')} />
        <MenuRow icon="settings" label="Cài đặt" onPress={() => go('settings')} />
      </MenuGroup>
    </Screen>
  );
}
export function ProfileDetailScreen({ id }: { id: ScreenId }) {
  if (id === 'profile-edit') return <EditProfile />;
  if (id === 'settings') return <Settings />;
  if (id === 'streak') return <Streak />;
  if (id === 'ranking') return <Ranking />;
  if (id === 'collection' || id === 'item-detail')
    return <Collection detail={id === 'item-detail'} />;
  return <Mascot detail={id === 'mascot-detail'} />;
}
function EditProfile() {
  const demo = useDemo();
  const [name, setName] = useState(demo.name);
  const [email, setEmail] = useState(demo.email);
  const [phone, setPhone] = useState(demo.registrationPhone || '0123456789');
  const [photo, setPhoto] = useState(false);
  const [initials, setInitials] = useState(false);
  const [error, setError] = useState('');
  return (
    <Screen
      title="Chỉnh sửa hồ sơ"
      onBack={() => back('profile')}
      footer={
        <Button
          label="Lưu thay đổi"
          onPress={() => {
            if (!name.trim()) {
              setError('Vui lòng nhập họ và tên.');
              return;
            }
            demo.setName(name.trim());
            demo.setEmail(email);
            demo.setRegistrationPhone(phone);
            go('profile', {}, true);
          }}
        />
      }
    >
      <Gap size={18} />
      <View style={{ alignItems: 'center' }}>
        <Avatar size={96} name={initials ? name : undefined} />
        <Gap size={12} />
        <TextButton label="Thay đổi ảnh" onPress={() => setPhoto(true)} />
      </View>
      <Gap size={30} />
      <Field
        label="Họ và tên"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError('');
        }}
      />
      {error && <T size={12}>{error}</T>}
      <Field label="Số điện thoại" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Dialog
        visible={photo}
        title="Ảnh đại diện"
        description="Chọn kiểu ảnh đại diện cho giao diện mẫu."
        onClose={() => setPhoto(false)}
      >
        <Row style={{ justifyContent: 'space-evenly' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ảnh người dùng"
            onPress={() => {
              setInitials(false);
              setPhoto(false);
            }}
          >
            <Avatar size={70} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ảnh chữ viết tắt"
            onPress={() => {
              setInitials(true);
              setPhoto(false);
            }}
          >
            <Avatar size={70} name={name} />
          </Pressable>
        </Row>
      </Dialog>
    </Screen>
  );
}
function Settings() {
  const demo = useDemo();
  const [sound, setSound] = useState(true);
  const [reminder, setReminder] = useState(false);
  const [logout, setLogout] = useState(false);
  const [info, setInfo] = useState<{ title: string; description: string } | null>(null);
  return (
    <Screen title="Cài đặt" onBack={() => back('profile')}>
      <T muted bold size={11}>
        TÀI KHOẢN
      </T>
      <MenuGroup>
        <MenuRow icon="user" label="Chỉnh sửa hồ sơ" onPress={() => go('profile-edit')} />
        <MenuRow icon="lock" label="Đổi mật khẩu" onPress={() => go('forgot-password')} />
      </MenuGroup>
      <Gap size={24} />
      <T muted bold size={11}>
        THÔNG BÁO
      </T>
      <MenuGroup>
        <MenuRow icon="bell" label="Thông báo">
          <Switch
            accessibilityLabel="Thông báo"
            value={demo.notifications}
            onValueChange={demo.setNotifications}
            trackColor={{ false: colors.neutral[200], true: colors.primary[800] }}
          />
        </MenuRow>
        <MenuRow icon="clock" label="Nhắc nhở học tập">
          <Switch
            accessibilityLabel="Nhắc nhở học tập"
            value={reminder}
            onValueChange={setReminder}
            trackColor={{ false: colors.neutral[200], true: colors.primary[800] }}
          />
        </MenuRow>
      </MenuGroup>
      <Gap size={16} />
      <T muted bold size={11}>
        ỨNG DỤNG
      </T>
      <MenuGroup>
        <MenuRow
          icon="globe"
          label="Ngôn ngữ"
          detail="Tiếng Việt"
          onPress={() =>
            setInfo({
              title: 'Ngôn ngữ',
              description: 'Ngôn ngữ hiện tại là tiếng Việt.',
            })
          }
        />
        <MenuRow icon="volume-2" label="Âm thanh">
          <Switch
            accessibilityLabel="Âm thanh"
            value={sound}
            onValueChange={setSound}
            trackColor={{ false: colors.neutral[200], true: colors.primary[800] }}
          />
        </MenuRow>
        <MenuRow icon="info" label="Phiên bản" detail="1.0.0" />
      </MenuGroup>
      <Gap size={24} />
      <T muted bold size={11}>
        HỖ TRỢ
      </T>
      <MenuGroup>
        <MenuRow
          icon="help-circle"
          label="Trợ giúp"
          onPress={() =>
            setInfo({
              title: 'Trợ giúp',
              description:
                'Dùng 4 tab bên dưới để xem các nhóm màn hình. Các nút trong mỗi màn sẽ đưa bạn qua những bước tương ứng.',
            })
          }
        />
        <MenuRow
          icon="file-text"
          label="Điều khoản sử dụng"
          onPress={() =>
            setInfo({
              title: 'Điều khoản sử dụng',
              description:
                'Đây là màn nội dung mẫu để xem luồng điều hướng. Nội dung điều khoản sẽ được bổ sung ở giai đoạn triển khai.',
            })
          }
        />
        <MenuRow
          icon="shield"
          label="Chính sách bảo mật"
          onPress={() =>
            setInfo({
              title: 'Chính sách bảo mật',
              description:
                'Bản giao diện mẫu dùng dữ liệu trong bộ nhớ và không gửi thông tin tài khoản đến máy chủ.',
            })
          }
        />
      </MenuGroup>
      <Gap size={20} />
      <Button label="Đăng xuất" variant="outline" icon="log-out" onPress={() => setLogout(true)} />
      <Gap size={15} />
      <TextButton label="Danh sách màn hình" muted onPress={() => go('screens')} />
      <Dialog
        visible={logout}
        title="Đăng xuất?"
        description="Bạn sẽ quay lại màn đăng nhập."
        onClose={() => setLogout(false)}
      >
        <Button
          label="Đăng xuất"
          onPress={() => {
            demo.reset();
            go('login', {}, true);
          }}
        />
        <Button label="Hủy" variant="outline" onPress={() => setLogout(false)} />
      </Dialog>
      <Notice
        visible={!!info}
        title={info?.title || ''}
        description={info?.description || ''}
        onClose={() => setInfo(null)}
      />
    </Screen>
  );
}
function Streak() {
  const palette = usePalette();
  return (
    <Screen title="Chuỗi ngày học" onBack={() => back('profile')}>
      <StreakWeekBadge streakDays={7} />
      <Gap size={14} />
      <Card style={{ padding: 16 }}>
        <Row between>
          <T bold size={16}>
            Tháng 10, 2026
          </T>
          <T bold size={12} style={{ color: themeColors.primary }}>
            Hôm nay: 21/10
          </T>
        </Row>
        <Gap size={20} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <View key={day} style={{ width: '14.285%', alignItems: 'center', marginBottom: 14 }}>
              <T muted size={12}>
                {day}
              </T>
            </View>
          ))}
          {Array.from({ length: 3 }, (_, i) => (
            <View key={`empty${i}`} style={{ width: '14.285%' }} />
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const active = day >= 15 && day <= 21;
            const isToday = day === 21;
            return (
              <View
                key={day}
                style={{ width: '14.285%', alignItems: 'center', paddingVertical: 6 }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: active
                      ? isToday
                        ? themeColors.fireOrange
                        : themeColors.primary
                      : palette.light,
                    borderWidth: isToday ? 2 : 0,
                    borderColor: themeColors.fireSoft,
                  }}
                >
                  <T bold={active} size={12} style={{ color: active ? '#fff' : palette.ink }}>
                    {day}
                  </T>
                </View>
              </View>
            );
          })}
        </View>
        <Gap size={12} />
        <Row between style={{ borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 12 }}>
          <Row style={{ gap: 4 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: themeColors.primary,
              }}
            />
            <T muted size={11}>
              Đã học
            </T>
          </Row>
          <Row style={{ gap: 4 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: palette.light,
              }}
            />
            <T muted size={11}>
              Chưa học
            </T>
          </Row>
          <Row style={{ gap: 4 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: themeColors.fireOrange,
              }}
            />
            <T bold size={11} style={{ color: themeColors.fireOrange }}>
              Hôm nay
            </T>
          </Row>
        </Row>
      </Card>
      <Gap size={22} />
      <Stats
        data={[
          { value: '7 ngày', label: 'Chuỗi hiện tại' },
          { value: '14 ngày', label: 'Chuỗi dài nhất' },
          { value: '31 ngày', label: 'Tổng số ngày học' },
        ]}
      />
      <Gap />
      <Card style={{ backgroundColor: palette.light }}>
        <Row>
          <Icon name="zap" color={palette.strong} />
          <T size={13} style={{ flex: 1 }}>
            Duy trì thói quen học tập để nối dài chuỗi ngày của bạn!
          </T>
        </Row>
      </Card>
    </Screen>
  );
}
function Ranking() {
  const [range, setRange] = useState('Tuần này');
  return (
    <Screen title="Bảng xếp hạng" onBack={() => back('profile')}>
      <TabSegments options={['Tuần này', 'Tháng này', 'Tất cả']} value={range} onChange={setRange} />
      <RankingContent />
    </Screen>
  );
}
function Collection({ detail }: { detail: boolean }) {
  const { equipped, setEquipped } = useDemo();
  const { item: itemName } = useLocalSearchParams<{ item?: string }>();
  const [filter, setFilter] = useState('Tất cả');
  const item = items.find((i) => i.name === itemName) || items[2];
  const palette = usePalette();
  return (
    <Screen title="Bộ sưu tập" onBack={() => back('profile')}>
      <Chips
        options={['Tất cả', 'Trang phục', 'Phụ kiện', 'Đồ dùng']}
        value={filter}
        onChange={setFilter}
      />
      <Gap size={12} />
      <View style={S.grid}>
        {items
          .filter(
            (i) =>
              filter === 'Tất cả' ||
              (i.name.includes('Trang phục')
                ? 'Trang phục'
                : i.name.includes('Ba lô')
                  ? 'Đồ dùng'
                  : 'Phụ kiện') === filter,
          )
          .map((i) => (
            <Card
              key={i.name}
              style={{ width: '48%', flexGrow: 1, padding: 10, gap: 4, minHeight: 240 }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Xem ${i.name}`}
                onPress={() => go('item-detail', { item: i.name })}
              >
                <View
                  style={{
                    height: 108,
                    borderRadius: 8,
                    backgroundColor: i.unlocked ? colors.primary[300] : colors.neutral[300],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                ></View>
              </Pressable>
              <T bold size={13}>
                {i.name}
              </T>
              <Row>
                <Icon
                  name={categories.find((c) => c.name === i.category)?.icon || 'shield'}
                  size={13}
                  color={palette.strong}
                />
                <T muted size={11}>
                  {i.category}
                </T>
              </Row>
              <Badge>
                {equipped === i.name ? 'Đang sử dụng' : i.unlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}
              </Badge>
              {i.unlocked && equipped !== i.name ? (
                <Button label="Trang bị" small onPress={() => setEquipped(i.name)} />
              ) : (
                <View style={{ height: 34 }} />
              )}
            </Card>
          ))}
      </View>
      <Dialog
        visible={detail}
        title=""
        onClose={() => back('collection')}
      >
        <ItemDetailCard
          title={item.name}
          category={item.category}
          description={
            item.unlocked
              ? 'Vật phẩm đã được mở khóa trong bộ sưu tập.'
              : 'Mở khóa khi hoàn thành kỹ năng Nấu ăn.'
          }
          status={equipped === item.name ? 'equipped' : item.unlocked ? 'unlocked' : 'locked'}
          onAction={() => {
            if (item.unlocked) {
              setEquipped(item.name);
              go('collection', {}, true);
            } else go('skill-detail', { title: 'Nấu ăn cơ bản' });
          }}
        />
        <Button label="Đóng" variant="outline" onPress={() => back('collection')} />
      </Dialog>
    </Screen>
  );
}
function Mascot({ detail }: { detail: boolean }) {
  const { equipped } = useDemo();
  const { mascot } = useLocalSearchParams<{ mascot?: string }>();
  const initial = Number(mascot);
  const [selected, setSelected] = useState(
    mascot !== undefined && Number.isInteger(initial) && initial >= 0 && initial < 4 ? initial : 1,
  );
  const [tab, setTab] = useState('Tất cả');
  const [notice, setNotice] = useState(false);
  const names = ['Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội'];
  const palette = usePalette();
  return (
    <Screen
      title={detail ? names[selected] : 'Mascot'}
      onBack={() => back(detail ? 'mascot' : 'profile')}
      footer={
        detail ? (
          <Button
            label="Lưu thay đổi"
            onPress={() => go('mascot', { mascot: String(selected) }, true)}
          />
        ) : undefined
      }
    >
      <Gap size={25} />
      <Row between>
        {!detail && (
          <IconButton
            name="chevron-left"
            label="Mascot trước"
            onPress={() => setSelected((selected + 3) % 4)}
          />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chi tiết mascot"
          onPress={() => !detail && go('mascot-detail', { mascot: String(selected) })}
          style={{ flex: 1 }}
        >
          <Placeholder height={204} icon={categories[selected].icon} label="Mascot" />
        </Pressable>
        {!detail && (
          <IconButton
            name="chevron-right"
            label="Mascot tiếp theo"
            onPress={() => setSelected((selected + 1) % 4)}
          />
        )}
      </Row>
      {!detail && (
        <>
          <Gap size={12} />
          <Row style={{ justifyContent: 'center', gap: 6 }}>
            {names.map((name, i) => (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityLabel={name}
                onPress={() => setSelected(i)}
                style={{
                  width: i === selected ? 18 : 6,
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: selected === i ? palette.strong : '#ccc',
                }}
              />
            ))}
          </Row>
          <Gap />
          <T center bold size={21}>
            {names[selected]}
          </T>

          <Gap size={7} />
          <Row>
            <Progress value={70} height={6} />
            <T size={10}>70/100</T>
          </Row>
          <Gap size={6} />
          <T muted center size={12}>
            Thu thập thêm 20 mảnh để mở khóa giai đoạn 3
          </T>
        </>
      )}
      <Gap size={40} />
      {detail ? (
        <>
          <Chips
            options={['Tất cả', 'Trang phục', 'Phụ kiện', 'Vật phẩm']}
            value={tab}
            onChange={setTab}
          />
          <View style={S.grid}>
            {items
              .filter(
                (i) =>
                  tab === 'Tất cả' ||
                  (tab === 'Trang phục'
                    ? i.name.includes('Trang phục')
                    : tab === 'Phụ kiện'
                      ? i.name.includes('Phụ kiện') || i.name.includes('Mũ')
                      : i.name.includes('Ba lô')),
              )
              .map((i) => (
                <Card
                  key={i.name}
                  label={i.name}
                  onPress={() => go('item-detail', { item: i.name })}
                  style={{ width: '48%', flexGrow: 1, padding: 10, gap: 10 }}
                >
                  <Placeholder label="" height={85} icon={i.icon} />
                  <T size={12} bold>
                    {i.name}
                  </T>
                  {equipped === i.name && <Badge>Đang sử dụng</Badge>}
                </Card>
              ))}
          </View>
        </>
      ) : (
        <>
          <Section title="Tiến trình phát triển" />
          <MascotEvolutionRow
            currentStage={2}
            onSelectStage={(stage) =>
              stage <= 2 ? go('mascot-detail', { mascot: String(selected) }) : setNotice(true)
            }
          />
        </>
      )}
      <Notice
        visible={notice}
        title="Chưa mở khóa"
        description="Hoàn thành thêm bài học để nhận XP và mở khóa giai đoạn tiến hóa tiếp theo."
        onClose={() => setNotice(false)}
      />
    </Screen>
  );
}
