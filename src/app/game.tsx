import { GameDoanPlayer } from '../features/gamedoan/GameDoanPlayer';

export default function GameRoute() {
  return <GameDoanPlayer initialView="play" exitTo="lesson-1" gameLesson={1} />;
}
