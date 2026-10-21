import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Avatar,
  Badge,
  Button,
  Card,
  C,
  Chips,
  Dialog,
  Field,
  Gap,
  Icon,
  IconButton,
  MenuRow,
  Notice,
  Placeholder,
  Progress,
  Row,
  Screen,
  Section,
  Segments,
  S,
  Stats,
  T,
  TextButton,
} from '../components/ui';
import { RankingContent } from '../components/content';
import { categories, items } from '../data/content';
import type { ScreenId } from '../data/screens';
import { back, go } from '../navigation';
import { useDemo } from '../state/demo';

export function ProfileScreen() {
  const { name } = useDemo();
  return (
    <Screen tabs="profile">
      <Gap size={20} />
      <View style={{ alignItems: 'center', gap: 14 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chỉnh sửa hồ sơ"
          onPress={() => go('profile-edit')}
        >
          <Avatar size={95} />
        </Pressable>
        <T bold size={23}>
          {name}
        </T>
      </View>
      <Gap size={25} />
      <Section title="Thành tích của bạn" />
      <Stats
        data={[
          { value: '3', label: 'Kỹ năng' },
          { value: '7 ngày', label: 'Chuỗi ngày học', onPress: () => go('streak') },
          { value: '872', label: 'Điểm số', onPress: () => go('ranking') },
        ]}
      />
      <Gap size={26} />
      <MenuRow icon="user" label="Chỉnh sửa hồ sơ" onPress={() => go('profile-edit')} />
      <MenuRow icon="zap" label="Chuỗi ngày học" onPress={() => go('streak')} />
      <MenuRow icon="award" label="Bảng xếp hạng" onPress={() => go('ranking')} />
      <MenuRow icon="star" label="Mascot" onPress={() => go('mascot')} />
      <MenuRow icon="grid" label="Bộ sưu tập" onPress={() => go('collection')} />
      <MenuRow icon="settings" label="Cài đặt" onPress={() => go('settings')} />
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
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Field label="Ngày sinh" defaultValue="01/01/2012" />
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
      <MenuRow icon="user" label="Chỉnh sửa hồ sơ" onPress={() => go('profile-edit')} />
      <MenuRow icon="lock" label="Đổi mật khẩu" onPress={() => go('forgot-password')} />
      <Gap size={24} />
      <T muted bold size={11}>
        THÔNG BÁO
      </T>
      <MenuRow icon="bell" label="Thông báo">
        <Switch
          accessibilityLabel="Thông báo"
          value={demo.notifications}
          onValueChange={demo.setNotifications}
          trackColor={{ false: '#ddd', true: '#444' }}
        />
      </MenuRow>
      <MenuRow icon="clock" label="Nhắc nhở học tập">
        <Switch
          accessibilityLabel="Nhắc nhở học tập"
          value={reminder}
          onValueChange={setReminder}
          trackColor={{ false: '#ddd', true: '#444' }}
        />
      </MenuRow>
      <Gap size={24} />
      <T muted bold size={11}>
        ỨNG DỤNG
      </T>
      <MenuRow
        icon="globe"
        label="Ngôn ngữ"
        detail="Tiếng Việt"
        onPress={() =>
          setInfo({
            title: 'Ngôn ngữ',
            description: 'Giao diện wireframe hiện sử dụng tiếng Việt.',
          })
        }
      />
      <MenuRow icon="volume-2" label="Âm thanh">
        <Switch
          accessibilityLabel="Âm thanh"
          value={sound}
          onValueChange={setSound}
          trackColor={{ false: '#ddd', true: '#444' }}
        />
      </MenuRow>
      <MenuRow icon="info" label="Phiên bản" detail="1.0.0" />
      <Gap size={24} />
      <T muted bold size={11}>
        HỖ TRỢ
      </T>
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
      <Gap size={20} />
      <Button label="Đăng xuất" variant="outline" icon="log-out" onPress={() => setLogout(true)} />
      <Gap size={15} />
      <TextButton label="Danh sách màn hình wireframe" muted onPress={() => go('screens')} />
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
  return (
    <Screen title="Chuỗi ngày học" onBack={() => back('profile')}>
      <Gap />
      <T bold center size={42}>
        7 ngày
      </T>
      <T muted center>
        Học mỗi ngày, tiến bộ mỗi ngày
      </T>
      <Gap size={28} />
      <Card>
        <Row between>
          <T bold>Tháng 10, 2026</T>
          <T muted size={11}>
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
            return (
              <View
                key={day}
                style={{ width: '14.285%', alignItems: 'center', paddingVertical: 6 }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: active ? C.ink : '#f5f5f5',
                    borderWidth: day === 21 ? 2 : 0,
                    borderColor: '#999',
                  }}
                >
                  <T size={12} style={{ color: active ? '#fff' : C.ink }}>
                    {day}
                  </T>
                </View>
              </View>
            );
          })}
        </View>
        <Gap />
        <Row between>
          <T muted size={10}>
            ● Đã học
          </T>
          <T muted size={10}>
            ○ Chưa học
          </T>
          <T muted size={10}>
            ◉ Hôm nay
          </T>
        </Row>
      </Card>
      <Gap size={22} />
      <Stats
        data={[
          { value: '7 ngày', label: 'Chuỗi hiện tại' },
          { value: '12 ngày', label: 'Chuỗi dài nhất' },
          { value: '18 ngày', label: 'Tổng ngày học' },
        ]}
      />
      <Gap />
      <Card style={{ backgroundColor: '#f5f5f5' }}>
        <Row>
          <Icon name="zap" color="#888" />
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
      <Segments options={['Tuần này', 'Tháng này', 'Tất cả']} value={range} onChange={setRange} />
      <RankingContent />
    </Screen>
  );
}
function Collection({ detail }: { detail: boolean }) {
  const { equipped, setEquipped } = useDemo();
  const { item: itemName } = useLocalSearchParams<{ item?: string }>();
  const [filter, setFilter] = useState('Tất cả');
  const item = items.find((i) => i.name === itemName) || items[2];
  return (
    <Screen title="Bộ sưu tập" onBack={() => back('profile')}>
      <Chips
        options={['Tất cả', 'Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội']}
        value={filter}
        onChange={setFilter}
      />
      <Gap size={12} />
      <View style={S.grid}>
        {items
          .filter((i) => filter === 'Tất cả' || i.category === filter)
          .map((i) => (
            <Card key={i.name} style={{ width: '48%', flexGrow: 1, padding: 10, gap: 10 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Xem ${i.name}`}
                onPress={() => go('item-detail', { item: i.name })}
              >
                <View
                  style={{
                    height: 108,
                    borderRadius: 8,
                    backgroundColor: '#f5f5f5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={i.icon} size={34} color="#999" />
                  {!i.unlocked && (
                    <View
                      style={{
                        position: 'absolute',
                        right: 6,
                        bottom: 6,
                        padding: 6,
                        borderRadius: 20,
                        backgroundColor: '#ddd',
                      }}
                    >
                      <Icon name="lock" size={14} color="#777" />
                    </View>
                  )}
                </View>
              </Pressable>
              <T bold size={13}>
                {i.name}
              </T>
              <Row>
                <Icon
                  name={categories.find((c) => c.name === i.category)?.icon || 'shield'}
                  size={13}
                  color="#999"
                />
                <T muted size={11}>
                  {i.category}
                </T>
              </Row>
              <Badge>
                {equipped === i.name ? 'Đang sử dụng' : i.unlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}
              </Badge>
              {i.unlocked && equipped !== i.name ? (
                <Button
                  label="Trang bị"
                  small
                  variant="outline"
                  onPress={() => setEquipped(i.name)}
                />
              ) : (
                <View style={{ height: 34 }} />
              )}
            </Card>
          ))}
      </View>
      <Dialog
        visible={detail}
        title={item.name}
        description={
          item.unlocked
            ? 'Vật phẩm đã được mở khóa trong bộ sưu tập.'
            : 'Mở khóa khi hoàn thành kỹ năng Nấu ăn.'
        }
        onClose={() => back('collection')}
      >
        <Placeholder label="" height={140} icon={item.icon} />
        <Row>
          <Icon name="heart" size={16} color="#999" />
          <T muted size={13}>
            {item.category}
          </T>
        </Row>
        <Button
          label={item.unlocked ? 'Trang bị' : 'Xem kỹ năng'}
          onPress={() => {
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
                  backgroundColor: selected === i ? C.ink : '#ccc',
                }}
              />
            ))}
          </Row>
          <Gap />
          <T center bold size={21}>
            Ngôi sao {names[selected].toLowerCase()}
          </T>
          <T center muted size={12}>
            Cấp độ 3 · 280/500 XP
          </T>
          <Gap size={7} />
          <Progress value={56} height={12} />
          <Gap size={6} />
          <T muted center size={12}>
            Cần thêm 220 XP để tiến hóa
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
          <Section title="Các giai đoạn tiến hóa" />
          <Row style={{ alignItems: 'stretch', gap: 8 }}>
            {['Đã mở khóa', 'Hiện tại', 'Chưa mở khóa'].map((label, i) => (
              <Card
                key={label}
                label={`Giai đoạn ${i + 1}: ${label}`}
                onPress={() =>
                  i < 2 ? go('mascot-detail', { mascot: String(selected) }) : setNotice(true)
                }
                style={{
                  flex: 1,
                  padding: 10,
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: i === 1 ? '#eee' : '#fff',
                }}
              >
                <Gap />
                <Icon name={i === 2 ? 'lock' : categories[selected].icon} size={36} color="#999" />
                <T center bold size={12}>
                  Giai đoạn {i + 1}
                </T>
                <T center muted size={10}>
                  {label}
                </T>
                <T center muted size={9}>
                  {i === 2 ? '500 XP' : 'Cấp ' + (i + 1)}
                </T>
              </Card>
            ))}
          </Row>
          <Gap size={25} />
          <Button
            label="Tùy chỉnh mascot"
            variant="outline"
            onPress={() => go('mascot-detail', { mascot: String(selected) })}
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
