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
  Empty,
  Field,
  Gap,
  Icon,
  IconButton,
  MenuRow,
  Notice,
  Placeholder,
  Progress,
  Radio,
  Row,
  Screen,
  Section,
  Segments,
  S,
  Stats,
  T,
  TextButton,
} from '../components/ui';
import { MemberRow, RankingContent, TaskCard } from '../components/content';
import { members, tasks } from '../data/content';
import type { ScreenId } from '../data/screens';
import { back, go } from '../navigation';
import { useDemo } from '../state/demo';

export function ClassesScreen() {
  const { currentClass, savedClasses } = useDemo();
  return currentClass || savedClasses.length ? <ClassList /> : <ClassEmpty />;
}
function ClassEmpty() {
  return (
    <Screen
      title="Lớp học"
      tabs="classes"
      onBack={() => go('home', {}, true)}
      right={<IconButton name="grid" label="Xem các lớp mẫu" onPress={() => go('classes-list')} />}
    >
      <Gap size={24} />
      <View style={{ width: 200, alignSelf: 'center' }}>
        <Placeholder height={200} style={{ borderRadius: 42 }} />
      </View>
      <Gap />
      <T bold center>
        Bạn chưa có lớp học nào
      </T>
      <Gap size={5} />
      <T muted size={12} center>
        Tham gia hoặc tạo một lớp mới để bắt đầu{`\n`}học cùng mọi người ngay thôi nào!
      </T>
      <Gap size={24} />
      <ClassActions />
      <Gap size={50} />
      <View style={{ padding: 14, backgroundColor: '#eee', marginHorizontal: -20 }}>
        <Section title="Gợi ý lớp học" />
        {['Kỹ năng sống A1', 'Kỹ năng sống A2'].map((name) => (
          <Card key={name} style={{ borderRadius: 2, padding: 12, marginBottom: 10 }}>
            <Row>
              <View style={{ width: 30, height: 30, backgroundColor: '#ddd' }} />
              <View style={{ flex: 1 }}>
                <T bold size={12}>
                  {name}
                </T>
                <T muted size={10}>
                  Kỹ năng sống mỗi ngày
                </T>
              </View>
              <Button
                small
                label="Tham gia"
                variant="soft"
                onPress={() => go('class-request', { name })}
              />
            </Row>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
function ClassActions() {
  return (
    <Row>
      <Button
        style={{ flex: 1 }}
        label="Tạo lớp"
        icon="plus"
        variant="soft"
        onPress={() => go('class-create')}
      />
      <Button
        style={{ flex: 1 }}
        label="Tham gia lớp"
        icon="log-in"
        variant="outline"
        onPress={() => go('class-join')}
      />
    </Row>
  );
}
function ClassList() {
  const { savedClasses, setCurrentClass } = useDemo();
  const [filter, setFilter] = useState('Tất cả');
  const all = [
    ...(savedClasses.length
      ? savedClasses
      : [
          {
            name: 'Lớp Kỹ năng sinh tồn',
            description: 'Học kỹ năng sống cùng nhau',
            role: 'owner' as const,
          },
        ]),
    { name: 'Lớp Nấu ăn cơ bản', description: 'Giáo viên: Trần Minh Đức', role: 'member' as const },
  ];
  return (
    <Screen title="Lớp học" tabs="classes" onBack={() => go('home', {}, true)}>
      <ClassActions />
      <Gap />
      <Chips
        options={['Tất cả', 'Lớp của tôi', 'Đã tham gia']}
        value={filter}
        onChange={setFilter}
      />
      <View style={{ gap: 14 }}>
        {all
          .filter(
            (c) =>
              filter === 'Tất cả' ||
              (filter === 'Lớp của tôi' ? c.role === 'owner' : c.role === 'member'),
          )
          .map((c) => (
            <Card
              key={c.name}
              onPress={() => {
                setCurrentClass(c);
                go(c.role === 'owner' ? 'class-detail' : 'class-joined');
              }}
              style={{ padding: 12, backgroundColor: '#fafafa' }}
            >
              <Row>
                <View
                  style={{ width: 62, height: 62, backgroundColor: '#aaa', borderRadius: 12 }}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <T bold size={13}>
                    {c.name}
                  </T>
                  <Badge>{c.role === 'owner' ? 'Lớp của tôi' : 'Đã tham gia'}</Badge>
                  <T muted size={10}>
                    {c.role === 'owner' ? '12 thành viên · 8 nhiệm vụ' : c.description}
                  </T>
                  <T muted size={10}>
                    ◉ ◉ ◉ +8
                  </T>
                </View>
                <Icon name="chevron-right" size={16} color="#aaa" />
              </Row>
            </Card>
          ))}
      </View>
    </Screen>
  );
}
export function ClassScreen({ id }: { id: ScreenId }) {
  if (id === 'classes-list') return <ClassList />;
  if (id === 'class-create' || id === 'class-created')
    return <CreateClass success={id === 'class-created'} />;
  if (['class-join', 'class-code', 'class-request', 'class-request-sent'].includes(id))
    return <JoinClass id={id} />;
  if (
    [
      'class-members',
      'class-members-view',
      'class-pending',
      'class-pending-empty',
      'class-accept',
      'class-reject',
    ].includes(id)
  )
    return <MembersScreen id={id} />;
  if (id === 'class-member-detail') return <MemberDetail />;
  if (
    [
      'class-tasks',
      'class-tasks-member',
      'class-task-create',
      'class-task-detail',
      'class-task-member',
      'class-task-progress',
    ].includes(id)
  )
    return <ClassTaskScreen id={id} />;
  if (id === 'class-progress') return <PersonalProgress />;
  if (id === 'class-settings') return <ClassSettings />;
  if (id === 'class-ranking') return <ClassRanking />;
  return <ClassDetail joined={id === 'class-joined'} leave={id === 'class-leave'} />;
}
function CreateClass({ success }: { success: boolean }) {
  const demo = useDemo();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [publicClass, setPublicClass] = useState(true);
  const [limit, setLimit] = useState(false);
  const [error, setError] = useState('');
  const create = () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên lớp.');
      return;
    }
    demo.saveClass({ name: name.trim(), description, role: 'owner' });
    go('class-created', {}, true);
  };
  return (
    <Screen
      title="Tạo lớp học"
      onBack={() => back('classes')}
      footer={<Button label="Tạo lớp" onPress={create} />}
    >
      <Field
        label="Tên lớp*"
        placeholder="Ví dụ: Kỹ năng sống 01"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError('');
        }}
      />
      {error && <T size={12}>{error}</T>}
      <Gap size={4} />
      <Field
        label="Mô tả lớp"
        placeholder="Giới thiệu về lớp"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Row between>
        <View>
          <T bold size={13}>
            Giới hạn thành viên
          </T>
          <T muted size={10}>
            Thiết lập số lượng người tối đa trong lớp
          </T>
        </View>
        <Switch
          accessibilityLabel="Giới hạn thành viên"
          value={limit}
          onValueChange={setLimit}
          trackColor={{ false: '#ddd', true: '#555' }}
        />
      </Row>
      {limit && <Field label="Số thành viên tối đa" placeholder="32" keyboardType="number-pad" />}
      <Gap size={70} />
      <Section title="Cài đặt lớp" />
      <Radio
        label="Công khai"
        description="Mọi người đều có thể tham gia"
        selected={publicClass}
        onPress={() => setPublicClass(true)}
      />
      <Radio
        label="Riêng tư"
        description="Chỉ người có mã lớp mới có thể gửi yêu cầu tham gia."
        selected={!publicClass}
        onPress={() => setPublicClass(false)}
      />
      <Dialog
        visible={success}
        title="Tạo lớp thành công"
        description={`Bạn đã tạo lớp “${demo.currentClass?.name || 'Kỹ năng sống 8A'}”`}
        onClose={() => go('classes', {}, true)}
      >
        <Placeholder height={170} />
        <Button label="Xem lớp ngay" onPress={() => go('class-detail', {}, true)} />
      </Dialog>
    </Screen>
  );
}
function JoinClass({ id }: { id: ScreenId }) {
  const params = useLocalSearchParams<{ name?: string; code?: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [qr, setQr] = useState(false);
  if (id === 'class-join')
    return (
      <Screen title="Tham gia lớp" onBack={() => back('classes')}>
        <Gap size={65} />
        <View style={{ alignItems: 'center', gap: 24 }}>
          <View style={{ padding: 30, borderRadius: 40, backgroundColor: '#f5f5f5' }}>
            <Icon name="maximize" size={50} color="#999" />
          </View>
          <T bold center>
            Nhập mã lớp để tham gia
          </T>
          <T size={13} muted center>
            Mã lớp thường gồm 6 ký tự, do người{`\n`}tạo lớp cung cấp.
          </T>
        </View>
        <Gap size={75} />
        <Button label="Nhập mã lớp" onPress={() => go('class-code')} />
        <Gap size={10} />
        <Button label="Quét mã QR" variant="outline" icon="maximize" onPress={() => setQr(true)} />
        <Notice
          visible={qr}
          title="Quét mã QR"
          description="Bản wireframe sử dụng mã lớp mẫu. Chọn Nhập mã lớp để tiếp tục luồng tham gia."
          onClose={() => setQr(false)}
        />
      </Screen>
    );
  if (id === 'class-code')
    return (
      <Screen title="Nhập mã lớp" onBack={() => back('class-join')}>
        <Gap />
        <Field
          label="Mã lớp"
          placeholder="Nhập mã lớp (VD: ABC123)"
          value={code}
          onChangeText={(v) => {
            setCode(
              v
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 6),
            );
            setError('');
          }}
          autoCapitalize="characters"
          maxLength={6}
        />
        {error && (
          <>
            <T size={12}>{error}</T>
            <Gap />
          </>
        )}
        <Button
          label="Tìm lớp"
          onPress={() => {
            if (code.length < 6) setError('Mã lớp gồm 6 ký tự. Thử ABC123.');
            else go('class-request', { code });
          }}
        />
      </Screen>
    );
  const name = params.name || 'Kỹ năng sống 8A';
  return (
    <Screen
      title="Thông tin lớp"
      onBack={() => back('class-code')}
      footer={
        <>
          <Button
            label="Gửi yêu cầu tham gia"
            variant="soft"
            onPress={() => go('class-request-sent', { name }, true)}
          />
          <Button label="Quay lại" variant="outline" onPress={() => back('class-code')} />
        </>
      }
    >
      <Gap size={24} />
      <View style={{ alignItems: 'center', gap: 10 }}>
        <View style={{ padding: 23, backgroundColor: '#eee', borderRadius: 18 }}>
          <Icon name="users" size={35} color="#999" />
        </View>
        <T bold size={19}>
          {name}
        </T>
        <T muted size={12}>
          Mã lớp: {params.code || 'ABC123'}
        </T>
      </View>
      <Gap size={28} />
      <Section title="Thông tin chung" />
      <MenuRow icon="user" label="Người tạo lớp" detail="Nguyễn Minh Anh" />
      <MenuRow icon="users" label="Thành viên" detail="18 thành viên" />
      <MenuRow icon="globe" label="Quyền riêng tư" detail="Công khai" />
      <Gap />
      <T bold size={13}>
        Mô tả
      </T>
      <Gap size={8} />
      <T muted size={13}>
        Lớp cùng học tập và thực hành các kỹ năng sống.
      </T>
      <Gap size={30} />
      <T muted size={12}>
        Bạn cần được quản trị viên chấp nhận trước khi trở thành thành viên.
      </T>
      <Dialog
        visible={id === 'class-request-sent'}
        title="Gửi yêu cầu thành công"
        description={`Yêu cầu tham gia lớp ${name} đã được gửi. Hãy đợi quản trị viên duyệt yêu cầu nhé!`}
        onClose={() => go('classes', {}, true)}
      >
        <Placeholder height={170} />
        <Button label="Về lớp học" onPress={() => go('classes', {}, true)} />
        <Button
          label="Xem lớp mẫu đã tham gia"
          variant="outline"
          onPress={() => go('class-joined', {}, true)}
        />
      </Dialog>
    </Screen>
  );
}
function ClassDetail({ joined, leave }: { joined: boolean; leave: boolean }) {
  const { currentClass, removeCurrentClass } = useDemo();
  const [copied, setCopied] = useState(false);
  const member = joined || leave;
  const className = currentClass?.name || 'Kỹ năng sống 8A';
  return (
    <Screen
      title="Thông tin lớp"
      tabs="classes"
      onBack={() => go('classes', {}, true)}
      right={
        <IconButton
          name="more-vertical"
          label="Cài đặt lớp"
          onPress={() => go(member ? 'class-leave' : 'class-settings')}
        />
      }
    >
      <Card style={{ backgroundColor: '#fafafa', gap: 8 }}>
        <Row between>
          <T bold size={17}>
            {className}
          </T>
          {!member && <TextButton label="Quản lý lớp" onPress={() => go('class-settings')} />}
        </Row>
        {member ? (
          <>
            <T muted size={12}>
              Giáo viên: Nguyễn Thị Lan
            </T>
            <T muted size={11}>
              ♧ 32 thành viên
            </T>
          </>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem mã lớp"
            onPress={() => setCopied(true)}
          >
            <T muted size={11}>
              ↗ Mã lớp: ABC123 ♧ 32 thành viên
            </T>
          </Pressable>
        )}
      </Card>
      <Gap />
      <Row between style={{ borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 12 }}>
        {[
          ['Tổng quan', ''],
          ['Nhiệm vụ', member ? 'class-tasks-member' : 'class-tasks'],
          ['Thành viên', member ? 'class-members-view' : 'class-members'],
          ['BXH', 'class-ranking'],
        ].map(([label, target]) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => target && go(target as ScreenId)}
          >
            <T bold={!target} muted={!!target} size={12}>
              {label}
            </T>
          </Pressable>
        ))}
      </Row>
      <Gap />
      {member ? (
        <>
          <Card style={{ gap: 14 }} onPress={() => go('class-progress')}>
            <Row between>
              <T bold size={13}>
                Tiến độ cá nhân
              </T>
              <T muted size={10}>
                Xem chi tiết
              </T>
            </Row>
            <T size={12}>7/12 nhiệm vụ đã hoàn thành</T>
            <Progress value={58} label="Tiến độ" />
            <T muted size={10}>
              7 hoàn thành · 3 đang thực hiện · 2 chưa bắt đầu
            </T>
          </Card>
          <Gap size={24} />
          <Section title="Nhiệm vụ hiện tại" />
          <TaskCard compact onPress={() => go('class-task-member')} />
          <Gap size={20} />
          <T muted bold size={10}>
            ĐÃ HOÀN THÀNH GẦN ĐÂY
          </T>
          <Gap size={8} />
          <Card
            style={{ backgroundColor: '#f6f6f6' }}
            onPress={() => go('class-task-member', { task: '1' })}
          >
            <Row between>
              <View>
                <T bold size={13}>
                  Lập kế hoạch chi tiêu
                </T>
                <T muted size={10}>
                  Hoàn thành: 10/10/2026
                </T>
              </View>
              <Badge>✓ Hoàn thành</Badge>
            </Row>
          </Card>
        </>
      ) : (
        <>
          <Stats
            data={[
              { value: '32', label: 'Thành viên', onPress: () => go('class-members') },
              { value: '5', label: 'Nhiệm vụ hoạt động', onPress: () => go('class-tasks') },
            ]}
          />
          <Gap size={12} />
          <Card style={{ padding: 12 }}>
            <Progress value={68} label="Tiến độ lớp học" />
          </Card>
        </>
      )}
      <Gap size={24} />
      <Section title={member ? 'Hoạt động lớp' : 'Hoạt động gần đây'} />
      {['Nguyễn Văn A hoàn thành nhiệm vụ', 'Lớp 8A nhận xếp hạng “Tinh thần học tập”'].map(
        (text, i) => (
          <Row key={text} style={{ marginBottom: 16 }}>
            <Avatar size={36} />
            <View style={{ flex: 1 }}>
              <T size={12}>{text}</T>
              <T muted size={10}>
                Hôm qua, {i ? '10:45' : '15:20'}
              </T>
            </View>
          </Row>
        ),
      )}
      <Notice
        visible={copied}
        title="Mã tham gia lớp"
        description="ABC123 — Bạn có thể dùng mã này trong luồng tham gia lớp mẫu."
        onClose={() => setCopied(false)}
      />
      <Dialog
        visible={leave}
        title="Rời lớp?"
        description={`Bạn sẽ rời khỏi lớp ${className}. Bạn có thể tham gia lại bằng mã lớp.`}
        onClose={() => go('class-joined', {}, true)}
      >
        <Button
          label="Rời lớp"
          onPress={() => {
            removeCurrentClass();
            go('classes', {}, true);
          }}
        />
        <Button label="Hủy" variant="outline" onPress={() => go('class-joined', {}, true)} />
      </Dialog>
    </Screen>
  );
}
function MembersScreen({ id }: { id: ScreenId }) {
  const { pendingMembers, setPendingMembers } = useDemo();
  const params = useLocalSearchParams<{ name?: string }>();
  const [query, setQuery] = useState('');
  const readOnly = id === 'class-members-view';
  const pending = ['class-pending', 'class-accept', 'class-reject', 'class-pending-empty'].includes(
    id,
  );
  const empty = id === 'class-pending-empty' || !pendingMembers.length;
  const name = params.name || pendingMembers[0] || 'Nguyễn Minh Anh';
  const confirm = () => {
    const next = pendingMembers.filter((n) => n !== name);
    setPendingMembers(next);
    go(next.length ? 'class-pending' : 'class-pending-empty', {}, true);
  };
  return (
    <Screen title="Thành viên" onBack={() => back(readOnly ? 'class-joined' : 'class-detail')}>
      <Field placeholder="Tìm thành viên" value={query} onChangeText={setQuery} />
      {!readOnly && (
        <Segments
          options={['Thành viên (32)', 'Chờ duyệt (3)']}
          value={pending ? 'Chờ duyệt (3)' : 'Thành viên (32)'}
          onChange={(v) => go(v.startsWith('Chờ') ? 'class-pending' : 'class-members', {}, true)}
        />
      )}
      {pending ? (
        empty ? (
          <Empty
            title="Không có yêu cầu chờ duyệt"
            description="Các yêu cầu tham gia mới sẽ hiển thị tại đây."
          />
        ) : (
          <>
            <Row between>
              <T bold size={12}>
                Chờ duyệt
              </T>
              <T muted size={11}>
                {pendingMembers.length} yêu cầu
              </T>
            </Row>
            <Gap />
            {pendingMembers
              .filter((n) => n.toLowerCase().includes(query.toLowerCase()))
              .map((n) => (
                <View key={n} style={{ marginBottom: 18 }}>
                  <MemberRow name={n} subtitle="Đang chờ duyệt" />
                  <Row>
                    <Button
                      small
                      label="Chấp nhận"
                      style={{ flex: 1 }}
                      onPress={() => go('class-accept', { name: n })}
                    />
                    <Button
                      small
                      label="Từ chối"
                      variant="outline"
                      style={{ flex: 1 }}
                      onPress={() => go('class-reject', { name: n })}
                    />
                  </Row>
                </View>
              ))}
          </>
        )
      ) : (
        <>
          <T muted size={11}>
            32 thành viên
          </T>
          {members
            .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
            .map((m) => (
              <MemberRow
                key={m.name}
                name={m.name}
                progress={readOnly ? undefined : m.progress}
                onPress={() =>
                  go('class-member-detail', { name: m.name, role: readOnly ? 'member' : 'owner' })
                }
              />
            ))}
        </>
      )}
      <Dialog
        visible={id === 'class-accept' || id === 'class-reject'}
        title={id === 'class-reject' ? 'Từ chối thành viên?' : 'Chấp nhận thành viên?'}
        description={`${name}\n${id === 'class-reject' ? 'Yêu cầu tham gia sẽ được xóa khỏi danh sách.' : 'Thành viên này sẽ được thêm vào lớp.'}`}
        onClose={() => back('class-pending')}
      >
        <Row>
          <Button
            label="Hủy"
            variant="outline"
            style={{ flex: 1 }}
            onPress={() => back('class-pending')}
          />
          <Button
            label={id === 'class-reject' ? 'Từ chối' : 'Chấp nhận'}
            style={{ flex: 1 }}
            onPress={confirm}
          />
        </Row>
      </Dialog>
    </Screen>
  );
}
function MemberDetail() {
  const { name = 'Nguyễn Văn An', role } = useLocalSearchParams<{ name?: string; role?: string }>();
  return (
    <Screen
      title="Chi tiết thành viên"
      onBack={() => back(role === 'member' ? 'class-members-view' : 'class-members')}
    >
      <Card>
        <Row>
          <Avatar size={50} />
          <View>
            <T bold>{name}</T>
            <T muted size={12}>
              Học viên
            </T>
          </View>
        </Row>
      </Card>
      <Gap />
      <Stats
        data={[
          { value: '12', label: 'Hoàn thành' },
          { value: '3', label: 'Đang làm' },
          { value: '5', label: 'Chưa bắt đầu' },
        ]}
      />
      <Gap size={24} />
      <Section title="Tiến độ tổng" />
      <Progress value={60} label="Tiến độ" />
      <Gap size={24} />
      <Section title="Lịch sử nhiệm vụ" />
      {['Chuẩn bị bữa sáng', 'Dọn dẹp phòng ngủ', 'Tự sơ cứu vết thương'].map((t, i) => (
        <MenuRow
          key={t}
          label={`Nhiệm vụ ${i + 1}: ${t}`}
          detail={['Hoàn thành', 'Đang làm', 'Chưa bắt đầu'][i]}
          onPress={() =>
            go(role === 'member' ? 'class-task-member' : 'class-task-detail', { task: String(i) })
          }
        />
      ))}
    </Screen>
  );
}
function ClassTaskScreen({ id }: { id: ScreenId }) {
  const { classTasks } = useDemo();
  const [filter, setFilter] = useState('Đang diễn ra');
  const [notice, setNotice] = useState(false);
  const params = useLocalSearchParams<{ task?: string }>();
  const task = classTasks.find((t) => t.id === (params.task || '0')) ?? tasks[0];
  if (id === 'class-task-create') return <CreateTask />;
  if (id === 'class-task-progress')
    return (
      <Screen
        title={task.title}
        onBack={() => back('class-task-detail')}
        footer={
          <Button
            label="Nhắc nhở thành viên chưa hoàn thành"
            icon="bell"
            onPress={() => setNotice(true)}
          />
        }
      >
        <Row between>
          <View>
            <T muted size={10}>
              TIẾN ĐỘ LỚP HỌC
            </T>
            <T muted size={11}>
              12/20 hoàn thành
            </T>
          </View>
          <T size={35} bold>
            60%
          </T>
        </Row>
        <Gap />
        <Progress value={60} height={9} />
        <Gap size={24} />
        <Stats
          data={[
            { value: '12', label: 'Đã hoàn thành' },
            { value: '3', label: 'Đang thực hiện' },
            { value: '5', label: 'Chưa bắt đầu' },
          ]}
        />
        <Gap />
        <Chips
          options={['Tất cả', 'Chưa bắt đầu', 'Đang làm']}
          value={filter === 'Đang diễn ra' ? 'Tất cả' : filter}
          onChange={setFilter}
          small
        />
        <Section title="Danh sách thành viên (5)" />
        {members
          .slice(0, 5)
          .filter(
            (m) =>
              filter === 'Đang diễn ra' ||
              filter === 'Tất cả' ||
              (filter === 'Chưa bắt đầu' ? m.progress === 0 : m.progress > 0 && m.progress < 100),
          )
          .map((m) => (
            <MemberRow
              key={m.name}
              name={m.name}
              progress={m.progress}
              subtitle={
                m.progress === 100 ? 'Hoàn thành' : m.progress === 0 ? 'Chưa bắt đầu' : 'Đang làm'
              }
              onPress={() => go('class-member-detail', { name: m.name })}
            />
          ))}
        <Notice
          visible={notice}
          title="Đã nhắc nhở"
          description="Đã xem thao tác nhắc nhở trong giao diện mẫu. Không gửi thông báo thật."
          onClose={() => setNotice(false)}
        />
      </Screen>
    );
  if (id === 'class-task-detail' || id === 'class-task-member') {
    const owner = id === 'class-task-detail';
    return (
      <Screen
        title="Chi tiết nhiệm vụ"
        onBack={() => back(owner ? 'class-tasks' : 'class-tasks-member')}
        right={
          owner ? (
            <IconButton
              name="more-horizontal"
              label="Chỉnh sửa nhiệm vụ"
              onPress={() => go('class-task-create', { task: task.id })}
            />
          ) : undefined
        }
        footer={
          owner ? (
            <>
              <Button
                label="Xem tiến độ"
                onPress={() => go('class-task-progress', { task: params.task || '0' })}
              />
              <Button
                label="Chỉnh sửa"
                variant="outline"
                onPress={() => go('class-task-create', { task: params.task || '0' })}
              />
            </>
          ) : (
            <Button label="Tiếp tục →" onPress={() => go('skill-detail', { title: task.title })} />
          )
        }
      >
        <Badge>{task.category.toUpperCase()}</Badge>
        <Gap size={14} />
        <T bold size={23}>
          {task.title}
        </T>
        <Gap />
        <T muted size={13}>
          {task.description ||
            'Học viên thực hành các bước xử lý tình huống khi có cháy xảy ra tại nhà hoặc trường học.'}
        </T>
        <Gap size={24} />
        {owner ? (
          <>
            <T bold muted size={10}>
              THÔNG TIN CƠ BẢN
            </T>
            <Gap />
            {[
              ['Giao cho', '20 thành viên'],
              ['Ngày bắt đầu', '01/10/2026'],
              ['Hạn hoàn thành', '15/10/2026'],
              ['Điều kiện hoàn thành', 'Hoàn thành bài học'],
            ].map(([label, value]) => (
              <Row between key={label} style={{ marginBottom: 16 }}>
                <T muted size={12}>
                  {label}
                </T>
                <T bold size={12}>
                  {value}
                </T>
              </Row>
            ))}
            <Gap />
            <Section title="Tiến độ lớp học" />
            <Progress value={60} label="60% hoàn thành — 12/20" />
            <Gap />
            <Stats
              data={[
                { value: '5', label: 'Chưa bắt đầu' },
                { value: '3', label: 'Đang làm' },
                { value: '12', label: 'Hoàn thành' },
              ]}
            />
          </>
        ) : (
          <>
            <Row>
              <Icon name="clock" size={14} color="#888" />
              <T muted size={12}>
                Hạn: {task.due}
              </T>
            </Row>
            <Gap size={24} />
            <Section title="Nội dung" />
            {[
              'Tìm hiểu các nguyên nhân gây cháy nổ',
              'Thực hành tìm lối thoát hiểm',
              'Thực hành gọi trợ giúp',
            ].map((t) => (
              <T key={t} size={13} muted>
                • {t}
              </T>
            ))}
            <Gap size={24} />
            <Section title="Mục tiêu học tập" />
            <T muted size={13}>
              Nhận biết dấu hiệu nguy hiểm và chọn hành động an toàn khi xảy ra cháy.
            </T>
            <Gap size={24} />
            <Section title="Điều kiện hoàn thành" />
            <Card onPress={() => go('skill-detail')}>
              <MenuRow
                icon="book-open"
                label="Bài học: Thoát hiểm khi có cháy"
                detail="Mini-game"
              />
            </Card>
          </>
        )}
      </Screen>
    );
  }
  const owner = id === 'class-tasks';
  const shown = classTasks.filter((t) =>
    owner
      ? filter === 'Đã hoàn thành'
        ? t.progress === 100
        : t.progress < 100
      : filter === 'Đang diễn ra' || filter === 'Tất cả' || t.status === filter,
  );
  return (
    <Screen title="Nhiệm vụ lớp" onBack={() => back(owner ? 'class-detail' : 'class-joined')}>
      {owner && (
        <>
          <Button label="Tạo nhiệm vụ" icon="plus" onPress={() => go('class-task-create')} />
          <Gap />
        </>
      )}
      {owner ? (
        <Segments options={['Đang diễn ra', 'Đã hoàn thành']} value={filter} onChange={setFilter} />
      ) : (
        <Chips
          options={['Tất cả', 'Đã hoàn thành', 'Đang làm', 'Chưa làm']}
          value={filter === 'Đang diễn ra' ? 'Tất cả' : filter}
          onChange={setFilter}
        />
      )}
      <View style={{ gap: 12 }}>
        {shown.map((t) =>
          owner ? (
            <Card
              key={t.id}
              label={t.title}
              style={{ gap: 13 }}
              onPress={() => go('class-task-detail', { task: t.id })}
            >
              <Badge>{t.category}</Badge>
              <T bold size={17}>
                {t.title}
              </T>
              <Progress
                value={t.id === '0' ? 60 : t.progress}
                label={`${Math.round((t.id === '0' ? 60 : t.progress) / 5)}/20 hoàn thành`}
              />
              <View style={S.divider} />
              <Row>
                <Icon name="calendar" size={14} color="#999" />
                <T muted size={12}>
                  Hạn: {t.due}
                </T>
              </Row>
            </Card>
          ) : (
            <TaskCard key={t.id} task={t} onPress={() => go('class-task-member', { task: t.id })} />
          ),
        )}
      </View>
    </Screen>
  );
}
function CreateTask() {
  const { classTasks, saveTask, currentClass } = useDemo();
  const { task } = useLocalSearchParams<{ task?: string }>();
  const initial = classTasks.find((t) => t.id === task);
  const [name, setName] = useState((initial?.title as string) || '');
  const [category, setCategory] = useState((initial?.category as string) || 'An toàn');
  const [assign, setAssign] = useState('Tất cả thành viên');
  const [error, setError] = useState('');
  const [description, setDescription] = useState(initial?.description || '');
  const [due, setDue] = useState(initial?.due || '19/10/2026');
  return (
    <Screen
      title={initial ? 'Chỉnh sửa nhiệm vụ' : 'Tạo nhiệm vụ'}
      onBack={() => back('class-tasks')}
      footer={
        <Button
          label={initial ? 'Lưu thay đổi' : 'Tạo nhiệm vụ'}
          onPress={() => {
            if (!name.trim()) {
              setError('Vui lòng nhập tên nhiệm vụ.');
              return;
            }
            saveTask({
              id: initial?.id || `task-${Date.now()}`,
              title: name.trim(),
              category,
              description,
              due,
              className: currentClass?.name || 'Lớp kỹ năng 8A',
              progress: initial?.progress || 0,
              status: initial?.status || 'Chưa làm',
            });
            go('class-tasks', {}, true);
          }}
        />
      }
    >
      <Field
        label="Tên nhiệm vụ"
        placeholder="Ví dụ: Thực hành dọn dẹp phòng ngủ"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setError('');
        }}
      />
      {error && <T size={12}>{error}</T>}
      <Field
        label="Mô tả ngắn"
        placeholder="Nhập tóm tắt yêu cầu nhiệm vụ..."
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Section title="Nhóm kỹ năng:" />
      <Chips
        options={['Tự lập', 'An toàn', 'Sức khỏe', 'Xã hội']}
        value={category}
        onChange={setCategory}
      />
      <Section title="Nội dung:" />
      <Card style={{ padding: 12 }} onPress={() => go('skill-category', { category })}>
        <Row between>
          <T size={13}>Kỹ năng xử lý khi có cháy</T>
          <Icon name="chevron-down" size={16} />
        </Row>
      </Card>
      <Gap size={24} />
      <Section title="Giao cho" />
      <Radio
        label="Tất cả thành viên"
        selected={assign === 'Tất cả thành viên'}
        onPress={() => setAssign('Tất cả thành viên')}
      />
      <Radio
        label="Chọn thành viên"
        selected={assign === 'Chọn thành viên'}
        onPress={() => setAssign('Chọn thành viên')}
      />
      {assign === 'Chọn thành viên' && <MemberPicker />}
      <Gap size={20} />
      <Section title="Thời hạn" />
      <Row style={{ alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Field label="Ngày bắt đầu" defaultValue="12/10/2026" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Hạn hoàn thành" value={due} onChangeText={setDue} />
        </View>
      </Row>
    </Screen>
  );
}
function MemberPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Card>
      {members.slice(0, 4).map((m) => (
        <Pressable
          key={m.name}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: selected.includes(m.name) }}
          onPress={() =>
            setSelected(
              selected.includes(m.name)
                ? selected.filter((n) => n !== m.name)
                : [...selected, m.name],
            )
          }
          style={{ paddingVertical: 9 }}
        >
          <Row>
            <Icon name={selected.includes(m.name) ? 'check-square' : 'square'} size={16} />
            <T size={12}>{m.name}</T>
          </Row>
        </Pressable>
      ))}
    </Card>
  );
}
function PersonalProgress() {
  return (
    <Screen title="Tiến độ" onBack={() => back('class-joined')}>
      <View style={{ alignItems: 'center', paddingVertical: 26, gap: 14 }}>
        <View
          style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            borderWidth: 12,
            borderColor: '#dedede',
            borderTopColor: '#555',
            borderRightColor: '#555',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <T bold size={33}>
            57%
          </T>
        </View>
        <T bold>4/7 nhiệm vụ hoàn thành</T>
        <T muted size={12}>
          Tuyệt vời! Bạn đang đi đúng hướng.
        </T>
      </View>
      <Stats
        data={[
          { value: '4', label: 'Hoàn thành' },
          { value: '1', label: 'Đang làm' },
          { value: '2', label: 'Còn lại' },
        ]}
      />
      <Gap size={24} />
      <Section title="Thành tích" />
      <MenuRow icon="award" label="Hoàn thành kỹ năng Sức khỏe" detail="100%" />
      <MenuRow icon="zap" label="Chuỗi 5 ngày học liên tiếp" />
      <Gap size={22} />
      <Section title="Lịch sử hoàn thành" />
      {['Sơ cứu cơ bản', 'Lập kế hoạch chi tiêu', 'Kỹ năng giao tiếp nhóm'].map((t) => (
        <Card key={t} style={{ marginBottom: 10, backgroundColor: '#fafafa', padding: 12 }}>
          <Row between>
            <View>
              <T bold size={12}>
                {t}
              </T>
              <T muted size={10}>
                08/10/2026
              </T>
            </View>
            <Badge>Hoàn thành</Badge>
          </Row>
        </Card>
      ))}
    </Screen>
  );
}
function ClassSettings() {
  const demo = useDemo();
  const [name, setName] = useState(demo.currentClass?.name || 'Kỹ năng sống 8A');
  const [description, setDescription] = useState(
    demo.currentClass?.description || 'Lớp học bồi dưỡng kỹ năng sống',
  );
  const [toggles, setToggles] = useState([true, false, true, true, true]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <Screen
      title="Cài đặt lớp"
      onBack={() => back('class-detail')}
      footer={
        <Button
          label="Lưu thay đổi"
          onPress={() => {
            demo.saveClass({ name, description, role: 'owner' }, demo.currentClass?.name);
            go('class-detail', {}, true);
          }}
        />
      }
    >
      <T muted bold size={11}>
        THÔNG TIN LỚP
      </T>
      <Gap />
      <Field label="Tên lớp" value={name} onChangeText={setName} />
      <Field label="Mô tả" value={description} onChangeText={setDescription} />
      <MenuRow label="Mã tham gia lớp" detail="ABC123" />
      <Gap />
      <T muted bold size={11}>
        QUYỀN THÀNH VIÊN
      </T>
      {[
        'Mời thành viên mới',
        'Xem tiến độ lẫn nhau',
        'Rời lớp',
        'Thông báo nhiệm vụ mới',
        'Nhắc nhở hạn hoàn thành',
      ].map((label, i) => (
        <View key={label}>
          {i === 3 && (
            <>
              <Gap />
              <T muted bold size={11}>
                THÔNG BÁO
              </T>
            </>
          )}
          <MenuRow label={label}>
            <Switch
              accessibilityLabel={label}
              value={toggles[i]}
              onValueChange={(v) => setToggles(toggles.map((x, index) => (index === i ? v : x)))}
              trackColor={{ false: '#ddd', true: '#444' }}
            />
          </MenuRow>
        </View>
      ))}
      <Gap />
      <Button label="Giải tán lớp" variant="outline" onPress={() => setDeleteOpen(true)} />
      <Gap size={8} />
      <T muted size={10} center>
        Hành động chỉ thay đổi dữ liệu mẫu trong phiên chạy.
      </T>
      <Dialog
        visible={deleteOpen}
        title="Giải tán lớp?"
        description="Lớp mẫu sẽ được xóa khỏi phiên xem hiện tại."
        onClose={() => setDeleteOpen(false)}
      >
        <Button
          label="Giải tán lớp"
          onPress={() => {
            demo.removeCurrentClass();
            go('classes', {}, true);
          }}
        />
        <Button label="Hủy" variant="outline" onPress={() => setDeleteOpen(false)} />
      </Dialog>
    </Screen>
  );
}
function ClassRanking() {
  const [range, setRange] = useState('Tuần này');
  return (
    <Screen title="Xếp hạng" onBack={() => back('class-detail')}>
      <Segments options={['Tuần này', 'Tháng này', 'Tất cả']} value={range} onChange={setRange} />
      <RankingContent />
    </Screen>
  );
}
