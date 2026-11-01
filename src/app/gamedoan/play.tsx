import { useLocalSearchParams } from 'expo-router';
import { GameDoanPlayer } from '../../features/gamedoan/GameDoanPlayer';
import { getGameDoanView } from '../../features/gamedoan/screens';

export default function GameDoanRoute() {
  const { view } = useLocalSearchParams<{ view?: string }>();
  return <GameDoanPlayer initialView={getGameDoanView(view)} />;
}
