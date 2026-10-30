import { LibraryScreen } from '../screens/skills';
import { DesignProvider } from '../design-system/theme';
export default function SkillsRoute() {
  return (
    <DesignProvider screen="skills">
      <LibraryScreen />
    </DesignProvider>
  );
}
