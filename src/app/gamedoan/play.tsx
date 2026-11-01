import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import GameDoanEmbed from '../../features/gamedoan/GameDoanEmbed';
import { getGameDoanView } from '../../features/gamedoan/screens';

export default function GameDoanRoute() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  const [initialView] = useState(() => getGameDoanView(view));
  const [active, setActive] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setActive(true);
      return () => setActive(false);
    }, []),
  );
  const onNavigate = useCallback(async (next: string) => {
    router.setParams({ view: next });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <Button
          label="Về danh mục GameDoAn"
          variant="outline"
          icon="arrow-left"
          onPress={() => router.replace('/gamedoan')}
        />
      </View>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {active && (
          <GameDoanEmbed
            initialView={initialView}
            onNavigate={onNavigate}
            dom={{ style: { flex: 1 }, scrollEnabled: false }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
