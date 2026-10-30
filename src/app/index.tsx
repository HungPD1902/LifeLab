import { SplashScreen } from '../screens/auth';
import { DesignProvider } from '../design-system/theme';
export default function SplashRoute() {
  return (
    <DesignProvider screen="splash">
      <SplashScreen />
    </DesignProvider>
  );
}
