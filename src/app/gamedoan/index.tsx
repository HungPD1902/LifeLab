import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Card, Gap, Screen, Section, T } from '../../components/ui';
import { DesignProvider } from '../../design-system/theme';
import { gameDoanSections } from '../../features/gamedoan/screens';
import { back } from '../../navigation';

export default function GameDoanGallery() {
  return (
    <DesignProvider screen="skills">
      <Screen title="GameDoAn" onBack={() => back('skills')}>
        <T muted>Bộ màn Nhà an toàn · Đội trưởng Tí</T>
        <Gap />
        <Button label="Mở Thư viện GameDoAn" onPress={() => router.push('/gamedoan/play')} />
        <Gap />
        <T muted size={12}>
          Học lần lượt để mở bài tiếp theo. Kết quả và xem lại xuất hiện sau mỗi lượt chơi hoặc kiểm
          tra.
        </T>
        <Gap size={24} />
        {gameDoanSections.map((section) => (
          <View key={section.title}>
            <Section title={section.title} />
            {section.screens.map((screen) => (
              <Card
                key={screen.view}
                label={screen.title}
                onPress={() =>
                  router.push({ pathname: '/gamedoan/play', params: { view: screen.view } })
                }
                style={{ marginBottom: 10 }}
              >
                <T bold>{screen.title}</T>
                <T muted size={12}>
                  {screen.description}
                </T>
              </Card>
            ))}
            <Gap />
          </View>
        ))}
      </Screen>
    </DesignProvider>
  );
}
