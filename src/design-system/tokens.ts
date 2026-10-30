// Read from Figma Design System 107:3169, 242:2148 and 131:7080.
export const colors = {
  neutral: {
    100: '#FFFFFF',
    200: '#D7D7D8',
    300: '#ADAFB1',
    400: '#82878C',
    500: '#5A5F65',
    600: '#444B52',
    700: '#30363D',
    800: '#1D2127',
    900: '#0B0D10',
  },
  primary: {
    100: '#F8FCFF',
    200: '#DDF2FF',
    300: '#ACDCFB',
    400: '#8DCCF6',
    500: '#70BAF0',
    600: '#47A5ED',
    700: '#1989E2',
    800: '#0F63A9',
    900: '#03355F',
  },
  green: { soft: '#E0FDC1', text: '#4A8419' },
  yellow: { soft: '#FBE3B7', text: '#5A5F65' },
} as const;

export const typography = {
  display: 36,
  h1: 28,
  h2: 24,
  h3: 20,
  title: 18,
  bodyLarge: 16,
  body: 14,
  bodySmall: 12,
  label: 14,
  caption: 12,
  buttonLarge: 18,
  buttonMedium: 15,
  buttonSmall: 12,
} as const;

export const buttonSizes = { large: 48, medium: 40, small: 32 } as const;
export const radius = {
  input: 10,
  buttonLarge: 12,
  buttonMedium: 10,
  buttonSmall: 8,
  card: 16,
  pill: 24,
} as const;

// Semantic color tokens for convenient local and shared usage across components
export const themeColors = {
  // Primary brand palette (Blue - LifeLab)
  primary: colors.primary[700], // #1989E2 - màu chủ đạo chính
  primaryHover: colors.primary[600], // #47A5ED - màu nút bấm chính
  primaryAccent: colors.primary[500], // #70BAF0
  primarySoft: colors.primary[100], // #F8FCFF - nền nhẹ
  primaryLight: colors.primary[200], // #DDF2FF - nền thẻ / badge / placeholder
  primaryBorder: colors.primary[300], // #ACDCFB - viền thẻ
  primaryNavy: colors.primary[800], // #0F63A9 - shadow nút / chữ phụ đậm
  primaryDark: colors.primary[900], // #03355F - tiêu đề đậm

  // Gamification & Specs (from Figma)
  starGold: '#F5A623',
  starSoft: colors.yellow.soft, // #FBE3B7
  starText: '#8A5300',
  successGreen: colors.green.soft, // #E0FDC1
  successText: colors.green.text, // #4A8419
  fireOrange: '#FF7A45', // Streak icon
  fireSoft: '#FFE7BA',
  errorRed: '#E53935',
  errorSoft: '#FFECEB',

  // Surfaces & Borders
  surface: colors.neutral[100], // #FFFFFF
  background: '#F7FAFC',
  border: colors.primary[200], // #DDF2FF
  borderNeutral: colors.neutral[200], // #D7D7D8

  // Typography
  textPrimary: colors.neutral[900], // #0B0D10
  textSecondary: colors.neutral[600], // #444B52
  textMuted: colors.neutral[500], // #5A5F65
  textDisabled: colors.neutral[300], // #ADAFB1
} as const;

// Shadow tokens from Figma Design System (Node 8:2, 131:7080, 428:14221)
export const shadows = {
  // 3D bottom bevel for buttons (Figma 131:7080)
  buttonBevelLarge: {
    borderBottomWidth: 4,
    borderBottomColor: colors.primary[800],
  },
  buttonBevelMedium: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary[800],
  },
  buttonBevelSmall: {
    borderBottomWidth: 2.5,
    borderBottomColor: colors.primary[800],
  },
  buttonBevelDisabled: {
    borderBottomWidth: 4,
    borderBottomColor: colors.neutral[300],
  },

  // Elevation drop shadows for cards & containers
  card: {
    shadowColor: '#0F63A9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardSubtle: {
    shadowColor: '#0F63A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  search: {
    shadowColor: '#1989E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  banner: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dialog: {
    shadowColor: '#03355F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
