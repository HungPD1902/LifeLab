import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  C,
  Gap,
  Icon,
  IconButton,
  Notice,
  Placeholder,
  Progress,
  Row,
  Screen,
  Section,
  S,
  Stats,
  T,
} from '../components/ui';
import { CategoryGrid } from '../components/content';
import { categories, lessons } from '../data/content';
import type { ScreenId } from '../data/screens';
import { back, go } from '../navigation';

export function LibraryScreen() {
  return (
    <Screen
      title="Thư viện"
      tabs="skills"
      onBack={() => go('home', {}, true)}
      right={
        <IconButton
          name="more-horizontal"
          label="Danh sách màn hình"
          onPress={() => go('screens')}
        />
      }
    >
      <CategoryGrid />
      <Gap size={24} />
      <Section title="Gợi ý cho bạn" action="Xem tất cả" onPress={() => go('suggestions')} />
      <View style={S.grid}>
        {[
          ['Nấu ăn cơ bản', 'Học cách nấu những món đơn giản.', 'Tự lập', 'coffee'],
          ['Sơ cứu vết thương', 'Xử lý vết thương nhẹ tại nhà.', 'Sức khỏe', 'activity'],
        ].map(([title, desc, cat, icon]) => (
          <Card
            key={title}
            label={title}
            onPress={() => go('skill-detail', { title })}
            style={{ flex: 1, padding: 12, gap: 8, backgroundColor: '#fafafa' }}
          >
            <Row>
              <Icon name={icon} color="#999" />
              <Badge>{cat}</Badge>
            </Row>
            <T bold size={13}>
              {title}
            </T>
            <T muted size={11}>
              {desc}
            </T>
            <Gap size={6} />
            <T muted size={10}>
              Chưa bắt đầu
            </T>
          </Card>
        ))}
      </View>
      <Gap size={18} />
      <Card style={{ padding: 12, backgroundColor: '#eee' }}>
        <Row>
          <Icon name="wind" color="#777" />
          <View style={{ flex: 1 }}>
            <T muted size={9}>
              ĐANG HỌC
            </T>
            <T bold size={12}>
              An toàn khi có cháy
            </T>
            <Progress value={65} height={4} />
          </View>
          <Button label="Tiếp tục" small onPress={() => go('skill-detail')} />
        </Row>
      </Card>
    </Screen>
  );
}
export function SkillScreen({ id }: { id: ScreenId }) {
  const params = useLocalSearchParams<{ category?: string; title?: string }>();
  const category = categories.find((c) => c.name === params.category) ?? categories[1];
  const title = params.title || 'An toàn khi có cháy';
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState(false);
  if (id === 'skill-category') {
    const names =
      category.name === 'An toàn'
        ? [
            'An toàn khi có cháy',
            'An toàn khi ở nhà một mình',
            'An toàn giao thông',
            'An toàn trên Internet',
          ]
        : category.name === 'Tự lập'
          ? [
              'Nấu ăn cơ bản',
              'Lập kế hoạch chi tiêu cá nhân',
              'Tự chuẩn bị bữa sáng',
              'Sắp xếp góc học tập',
            ]
          : category.name === 'Sức khỏe'
            ? ['Sơ cứu vết trầy xước', 'Ăn uống lành mạnh', 'Vệ sinh cá nhân', 'Vận động mỗi ngày']
            : [
                'Lắng nghe để hiểu bạn',
                'Kỹ năng giao tiếp nhóm',
                'Chia sẻ và hợp tác',
                'Ứng xử lịch sự',
              ];
    return (
      <Screen
        title={category.name}
        tabs="skills"
        onBack={() => go('skills', {}, true)}
        right={
          <IconButton name="search" label="Tìm kiếm kỹ năng" onPress={() => setNotice(true)} />
        }
      >
        <Card style={{ backgroundColor: '#f3f3f3', gap: 14 }}>
          <Row>
            <View style={{ padding: 13, borderRadius: 30, backgroundColor: '#aaa' }}>
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
          {names.map((name, i) => (
            <Card
              key={name}
              label={name}
              onPress={() => go('skill-detail', { title: name, category: category.name })}
              style={{ padding: 13, gap: 7 }}
            >
              <Row between>
                <View style={{ flex: 1 }}>
                  <T bold>{name}</T>
                  <T muted size={11}>
                    {i === 0 ? 'Nhận biết và xử lý tình huống nguy hiểm' : category.description}
                  </T>
                </View>
                <Icon name="chevron-right" color="#aaa" size={16} />
              </Row>
              <Row>
                <Progress value={[65, 100, 0, 30][i]} height={5} />
                <T muted size={10}>
                  {[65, 100, 0, 30][i]}%
                </T>
                <Badge dark={i === 1}>
                  {i === 1 ? 'Hoàn thành' : i === 2 ? 'Chưa học' : 'Đang học'}
                </Badge>
              </Row>
            </Card>
          ))}
        </View>
        <Notice
          visible={notice}
          title="Tìm kỹ năng"
          description="Chọn một kỹ năng trong danh sách để xem nội dung và bắt đầu học."
          onClose={() => setNotice(false)}
        />
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
        <Placeholder icon="wind" label="MINH HỌA KỸ NĂNG" height={126} dashed />
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
        {[
          'Nhận biết nguy cơ cháy',
          'Biết cách xử lý khi phát hiện cháy',
          'Biết cách tìm lối thoát hiểm',
          'Biết cách gọi trợ giúp',
        ].map((t) => (
          <Row key={t} style={{ marginBottom: 10 }}>
            <Icon name="check-square" size={16} color="#777" />
            <T size={13} muted>
              {t}
            </T>
          </Row>
        ))}
        <Gap />
        <Section title="Bài học" />
        <View style={{ gap: 8 }}>
          {lessons.map((lesson, i) => (
            <Card
              key={lesson}
              label={lesson}
              onPress={() => go(`lesson-${i + 1}` as ScreenId, { title })}
              style={{
                padding: 12,
                backgroundColor: i === 0 ? '#eee' : i > 1 ? '#fafafa' : '#fff',
                borderColor: i === 1 ? '#555' : C.line,
              }}
            >
              <Row>
                <View
                  style={{
                    width: 23,
                    height: 23,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#aaa',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: i === 0 ? C.ink : '#fff',
                  }}
                >
                  {i === 0 ? (
                    <Icon name="check" size={14} color="#fff" />
                  ) : (
                    <T size={12}>{i + 1}</T>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <T bold size={12}>
                    {i === 0 ? 'Nhận biết' : i === 3 ? 'Kiểm tra' : lesson}
                  </T>
                  <T muted size={10}>
                    {i === 0 ? 'Đã hoàn thành' : i === 1 ? 'Đang học' : 'Chưa mở'}
                  </T>
                </View>
                <Icon
                  name={i === 0 ? 'check-circle' : i === 1 ? 'play' : 'lock'}
                  size={15}
                  color="#999"
                />
              </Row>
            </Card>
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
        <Gap size={35} />
        <T center muted size={11}>
          ĐIỂM CỦA BẠN
        </T>
        <T center size={50} bold>
          80
        </T>
        <T center muted size={12}>
          ♧ Điểm tốt nhất: 80/100
        </T>
        <Gap size={5} />
        <T center muted size={12}>
          Bạn đã hoàn thành Bài 3: Xử lý tình huống
        </T>
        <Gap size={22} />
        <Stats
          data={[
            { value: '8/10', label: 'Câu đúng' },
            { value: '2', label: 'Câu chưa đúng' },
            { value: '04:32', label: 'Thời gian' },
          ]}
        />
        <Gap size={22} />
        <Section title="Kết quả học tập" />
        <Card style={{ backgroundColor: '#f7f7f7', gap: 14 }}>
          {[
            'Học được cách cần thoát hiểm.',
            'Lựa chọn hành động an toàn trong từng tình huống.',
            'Bạn có thể xem lại các tình huống chưa chọn đúng.',
          ].map((t) => (
            <Row key={t}>
              <Icon name="check-circle" size={16} color="#999" />
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
            { value: '+80 XP', label: 'Sao' },
            { value: '+15 mảnh', label: 'Tiến hóa mascot' },
          ]}
        />
        <Gap />
        <Section title="Tiến độ bài học" />
        <Card>
          <Row between>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                <Icon name={i < 4 ? 'check-circle' : 'lock'} color={i < 4 ? C.ink : '#aaa'} />
                <T size={10}>Bài {i}</T>
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
      subtitle={`BÀI ${step}`}
      onBack={() => back('skill-detail')}
      footer={
        <Button
          label={step === 4 ? 'Kiểm tra' : 'Bắt đầu'}
          onPress={() => go(step === 4 ? 'result' : (`lesson-${step + 1}` as ScreenId), { title })}
        />
      }
    >
      {step === 4 ? (
        <Card style={{ borderStyle: 'dashed', backgroundColor: '#fafafa' }}>
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
                <Icon name={icon} color="#888" />
                <T center size={8}>
                  {label}
                </T>
              </Card>
            ))}
          </View>
        </Card>
      ) : (
        <Placeholder icon="wind" label="MINH HỌA GAME" height={130} dashed />
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
              CÁCH CHƠI
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
            THÔNG TIN TRÒ CHƠI
          </T>
          <Gap size={8} />
        </>
      )}
      <Card style={{ padding: 12 }}>
        <Row between>
          {[
            ['clock', '5 phút', 'Thời gian'],
            [
              'bar-chart-2',
              step === 4 ? '5–10 câu' : '●●○',
              step === 4 ? 'Số lượng' : 'Độ khó: Vừa',
            ],
            ['star', '+10 XP | +1 Sao', 'Phần thưởng'],
          ].map(([icon, value, label]) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
              <Icon name={icon} size={14} color="#888" />
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
