import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import GameDoanEmbed from './GameDoanEmbed';
import type { GameDoanView } from './screens';

export function GameDoanPlayer({
  initialView: requestedView,
  exitTo = 'gamedoan',
  gameLesson,
}: {
  initialView: GameDoanView;
  exitTo?: 'gamedoan' | 'lesson-1';
  gameLesson?: 1;
}) {
  const [initialView] = useState(requestedView);
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
  const onContinue = useCallback(async () => {
    router.replace('/lesson-2');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <Button
          label={exitTo === 'lesson-1' ? 'Về bài 1' : 'Về danh mục GameDoAn'}
          variant="outline"
          icon="arrow-left"
          onPress={() => router.replace(exitTo === 'lesson-1' ? '/lesson-1' : '/gamedoan')}
        />
      </View>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        {active && (
          <GameDoanEmbed
            initialView={initialView}
            onNavigate={onNavigate}
            gameLesson={gameLesson}
            onContinue={onContinue}
            dom={{ style: { flex: 1 }, scrollEnabled: false }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
