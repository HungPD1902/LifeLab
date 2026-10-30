import { HomeScreen } from '../screens/home';
import { DesignProvider } from '../design-system/theme';
export default function HomeRoute() {
  return (
    <DesignProvider screen="home">
      <HomeScreen />
    </DesignProvider>
  );
}
