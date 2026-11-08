'use dom';

import { useEffect, useRef } from 'react';

type Props = {
  initialView: string;
  onNavigate: (view: string) => Promise<void>;
  gameLesson?: 1;
  onContinue: () => Promise<void>;
  onBack: () => Promise<void>;
  dom?: import('expo/dom').DOMProps;
};

// Keep the original document isolated: its global CSS, timers and audio own this frame.
export default function GameDoanEmbed({
  initialView,
  onNavigate,
  gameLesson,
  onContinue,
  onBack,
}: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const base = `${process.env.EXPO_BASE_URL ?? '/'}`.replace(/\/?$/, '/');

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'lifelab:gamedoan:back') {
        void onBack();
        return;
      }
      if (event.data?.type === 'lifelab:gamedoan:continue') {
        void onContinue();
        return;
      }
      if (event.data?.type === 'lifelab:gamedoan:screen' && typeof event.data.view === 'string') {
        void onNavigate(event.data.view);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [onNavigate, onContinue, onBack]);

  return (
    <iframe
      ref={frame}
      title="GameDoAn · Nhà an toàn"
      src={`${base}games/gamedoan/lifelab.html?screen=${encodeURIComponent(initialView)}&lesson=${gameLesson ?? 3}`}
      allow="autoplay"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'block',
        width: '100%',
        height: '100%',
        border: 0,
        background: '#fff',
      }}
    />
  );
}
