import { ProfileScreen } from '../screens/profile';
import { DesignProvider } from '../design-system/theme';
export default function ProfileRoute() {
  return (
    <DesignProvider screen="profile">
      <ProfileScreen />
    </DesignProvider>
  );
}
