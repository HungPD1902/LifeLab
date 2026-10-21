import { router } from 'expo-router';
import type { ScreenId } from './data/screens';

export function go(
  screen: ScreenId | 'screens',
  params: Record<string, string> = {},
  replace = false,
) {
  const pathname = screen === 'splash' ? '/' : `/${screen}`;
  const href = { pathname: pathname as '/[screen]', params };
  if (replace) router.replace(href);
  else router.push(href);
}

export function back(fallback: ScreenId = 'home') {
  if (router.canGoBack()) router.back();
  else go(fallback, {}, true);
}
