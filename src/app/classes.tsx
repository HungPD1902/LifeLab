import { ClassesScreen } from '../screens/classes';
import { DesignProvider } from '../design-system/theme';
export default function ClassesRoute() {
  return (
    <DesignProvider screen="classes">
      <ClassesScreen />
    </DesignProvider>
  );
}
