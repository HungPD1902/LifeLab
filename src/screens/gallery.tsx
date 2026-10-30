import { View } from 'react-native';
import { Badge, Button, Card, Gap, Row, Screen, Section, T } from '../components/ui';
import { screenMeta, ScreenId } from '../data/screens';
import { go } from '../navigation';
import { uiSources } from '../design-system/coverage';

export function ScreenGallery() {
  const groups = [
    ['auth', 'Onboarding & Tài khoản'],
    ['home', 'Trang chủ'],
    ['skills', 'Kỹ năng'],
    ['classes', 'Lớp học'],
    ['profile', 'Cá nhân'],
  ] as const;
  return (
    <Screen title="Danh mục màn hình">
      <T muted size={12}>
        Danh mục đối chiếu các màn hình với node Figma. Chọn một màn để xem trực tiếp.
      </T>
      <Gap size={12} />
      <Button
        label="❖ Thư viện Components (Design System 8:2)"
        icon="box"
        onPress={() => go('components')}
      />
      <Gap size={20} />
      {groups.map(([group, title]) => (
        <View key={group}>
          <Section title={title} />
          {(Object.entries(screenMeta) as [ScreenId, (typeof screenMeta)[ScreenId]][])
            .filter(([, meta]) => meta.group === group)
            .map(([id, meta]) => (
              <Card
                key={id}
                label={meta.title}
                onPress={() => go(id)}
                style={{ marginBottom: 8, padding: 12, borderRadius: 7 }}
              >
                <Row between>
                  <View style={{ flex: 1 }}>
                    <T bold size={13}>
                      {meta.title}
                    </T>
                    <T muted size={10}>
                      /{id === 'splash' ? '' : id}
                    </T>
                  </View>
                  <Badge>
                    {uiSources[id]
                      ? `UI · ${uiSources[id]}`
                      : meta.node
                        ? `Wireframe · ${meta.node}`
                        : 'Bổ sung'}
                  </Badge>
                </Row>
              </Card>
            ))}
          <Gap size={20} />
        </View>
      ))}
    </Screen>
  );
}
