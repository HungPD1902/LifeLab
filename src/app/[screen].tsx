import { useLocalSearchParams } from 'expo-router';
import { AuthScreen } from '../screens/auth';
import { HomeDetailScreen } from '../screens/home';
import { SkillScreen } from '../screens/skills';
import { ClassScreen } from '../screens/classes';
import { ProfileDetailScreen } from '../screens/profile';
import { ScreenGallery } from '../screens/gallery';
import { screenMeta, ScreenId } from '../data/screens';
import { Button, Screen, T } from '../components/ui';
import { go } from '../navigation';

export default function DetailRoute() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  if (screen === 'screens') return <ScreenGallery />;
  const meta = screenMeta[screen as ScreenId];
  if (!meta)
    return (
      <Screen title="Không tìm thấy màn hình">
        <T>Đường dẫn này không tồn tại.</T>
        <Button label="Về trang chủ" onPress={() => go('home', {}, true)} />
      </Screen>
    );
  if (meta.group === 'auth') return <AuthScreen key={screen} id={screen as ScreenId} />;
  if (meta.group === 'home') return <HomeDetailScreen id={screen as ScreenId} />;
  if (meta.group === 'skills') return <SkillScreen id={screen as ScreenId} />;
  if (meta.group === 'classes') return <ClassScreen id={screen as ScreenId} />;
  return <ProfileDetailScreen id={screen as ScreenId} />;
}
