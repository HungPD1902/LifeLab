import { createContext, PropsWithChildren, useContext } from 'react';
import { uiSources } from './coverage';
import { colors, themeColors } from './tokens';
import type { ScreenId } from '../data/screens';

const DesignContext = createContext(false);
export const FontReadyContext = createContext(false);
const wireframe = {
  ink: '#202020',
  muted: '#858585',
  line: '#dedede',
  light: '#f5f5f5',
  fill: '#d9d9d9',
  white: '#fff',
  accent: '#202020',
  strong: '#202020',
  primary: '#202020',
  primaryHover: '#333333',
  primaryLight: '#f0f0f0',
  primarySoft: '#f9f9f9',
  cardBg: '#ffffff',
  star: '#858585',
  starBg: '#f5f5f5',
  success: '#555555',
  successBg: '#eeeeee',
  fire: '#666666',
  fireBg: '#eeeeee',
  border: '#dedede',
};
const design = {
  ink: colors.primary[900],
  muted: colors.neutral[500],
  line: colors.primary[200],
  light: colors.primary[100],
  fill: colors.primary[200],
  white: colors.neutral[100],
  accent: colors.primary[500],
  strong: colors.primary[800],
  primary: themeColors.primary,
  primaryHover: themeColors.primaryHover,
  primaryLight: themeColors.primaryLight,
  primarySoft: themeColors.primarySoft,
  cardBg: colors.neutral[100],
  star: themeColors.starGold,
  starBg: themeColors.starSoft,
  success: themeColors.successText,
  successBg: themeColors.successGreen,
  fire: themeColors.fireOrange,
  fireBg: themeColors.fireSoft,
  border: colors.primary[200],
};

export function DesignProvider({ screen, children }: PropsWithChildren<{ screen: string }>) {
  return (
    <DesignContext.Provider value={!!uiSources[screen as ScreenId]}>
      {children}
    </DesignContext.Provider>
  );
}
export function useDesign() {
  return useContext(DesignContext);
}
export function usePalette() {
  return useDesign() ? design : wireframe;
}
export function useDesignFont() {
  return undefined;
}
