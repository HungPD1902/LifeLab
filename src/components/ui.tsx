import { Feather } from '@expo/vector-icons';
import {
  Children,
  ComponentProps,
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { back, go } from '../navigation';
import { useDesign, useDesignFont, usePalette } from '../design-system/theme';
import { buttonSizes, colors, radius, themeColors } from '../design-system/tokens';

export const C = {
  ink: '#202020',
  muted: '#858585',
  line: '#dedede',
  light: '#f5f5f5',
  fill: '#d9d9d9',
  white: '#fff',
};
const ButtonSizeContext = createContext<keyof typeof buttonSizes>('large');

export type IconName = ComponentProps<typeof Feather>['name'];
export function Icon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const palette = usePalette();
  return <Feather name={name as IconName} size={size} color={color ?? palette.ink} />;
}
export function T({
  children,
  style,
  muted,
  bold,
  center,
  size = 14,
}: PropsWithChildren<{
  style?: StyleProp<TextStyle>;
  muted?: boolean;
  bold?: boolean;
  center?: boolean;
  size?: number;
}>) {
  const palette = usePalette();
  const fontFamily = useDesignFont();
  return (
    <Text
      style={[
        {
          fontSize: size,
          lineHeight: size * 1.45,
          color: muted ? palette.muted : palette.ink,
          fontFamily,
          fontWeight: bold ? '700' : '400',
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Row({
  children,
  style,
  between,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; between?: boolean }>) {
  return (
    <View style={[S.row, between && { justifyContent: 'space-between' }, style]}>{children}</View>
  );
}
export function Gap({ size = 16 }: { size?: number }) {
  return <View style={{ height: size }} />;
}
export function Card({
  children,
  style,
  onPress,
  label,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string }>) {
  const design = useDesign();
  const base = [
    S.card,
    design && {
      borderRadius: radius.card,
      borderWidth: 1.5,
      borderColor: colors.primary[300],
      backgroundColor: '#fff',
      shadowColor: '#0F63A9',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
  ];
  if (onPress)
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [
          base,
          pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  return <View style={[base, style]}>{children}</View>;
}
export function Button({
  label,
  onPress,
  variant = 'primary',
  small,
  size,
  icon,
  iconRight,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'soft' | 'text';
  small?: boolean;
  size?: keyof typeof buttonSizes;
  icon?: string;
  iconRight?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const design = useDesign();
  const palette = usePalette();
  const defaultSize = useContext(ButtonSizeContext);
  const dimension = size ?? (small ? 'small' : defaultSize);
  const primary = variant === 'primary';
  const outline = variant === 'outline';
  const soft = variant === 'soft';
  const textVariant = variant === 'text';

  const btnRadius =
    dimension === 'large'
      ? radius.buttonLarge
      : dimension === 'medium'
        ? radius.buttonMedium
        : radius.buttonSmall;

  const bevelHeight = dimension === 'large' ? 4 : dimension === 'medium' ? 3 : 2.5;

  const foreground =
    disabled && design
      ? colors.neutral[400]
      : primary
        ? palette.white
        : outline
          ? design
            ? colors.primary[700]
            : palette.ink
          : soft
            ? colors.primary[700]
            : textVariant
              ? design
                ? colors.primary[700]
                : palette.ink
              : palette.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        S.button,
        {
          minHeight: design ? buttonSizes[dimension] : small ? 34 : 52,
          paddingHorizontal: dimension === 'large' ? 20 : dimension === 'medium' ? 16 : 12,
          borderRadius: design ? btnRadius : 7,
          backgroundColor: primary
            ? pressed && !disabled
              ? colors.primary[800]
              : colors.primary[600]
            : outline
              ? pressed && !disabled
                ? colors.primary[200]
                : palette.white
              : soft
                ? pressed && !disabled
                  ? colors.primary[300]
                  : colors.primary[200]
                : textVariant
                  ? 'transparent'
                  : palette.white,
          borderWidth: design ? (outline ? 1.5 : primary ? 1 : 0) : 1,
          borderColor: outline
            ? design
              ? colors.primary[700]
              : palette.line
            : primary
              ? design
                ? colors.primary[500]
                : 'transparent'
              : 'transparent',
        },
        design &&
          primary &&
          !disabled && {
            borderBottomWidth: pressed ? 1.5 : bevelHeight,
            borderBottomColor: colors.primary[800],
            transform: pressed ? [{ translateY: 2 }] : undefined,
          },
        design &&
          outline &&
          !disabled && {
            borderBottomWidth: pressed ? 1.5 : bevelHeight,
            borderBottomColor: colors.primary[700],
            transform: pressed ? [{ translateY: 2 }] : undefined,
          },
        disabled &&
          (design
            ? {
                backgroundColor: colors.neutral[200],
                borderColor: colors.neutral[300],
                borderBottomWidth: bevelHeight,
                borderBottomColor: colors.neutral[300],
              }
            : { opacity: 0.4 }),
        pressed && !disabled && !design && { opacity: 0.65 },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={dimension === 'small' ? 14 : 18} color={foreground} />}
      <T
        bold
        size={
          design
            ? dimension === 'large'
              ? 18
              : dimension === 'medium'
                ? 15
                : 12
            : small
              ? 12
              : 15
        }
        style={{ color: foreground, flexShrink: 1, textAlign: 'center' }}
      >
        {label}
      </T>
      {iconRight && (
        <Icon name={iconRight} size={dimension === 'small' ? 14 : 18} color={foreground} />
      )}
    </Pressable>
  );
}
export function TextButton({
  label,
  onPress,
  muted,
}: {
  label: string;
  onPress: () => void;
  muted?: boolean;
}) {
  const design = useDesign();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={{ paddingVertical: 5 }}
    >
      <T bold muted={muted} style={design && !muted ? { color: colors.primary[700] } : undefined}>
        {label}
      </T>
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
}: {
  name: string;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={S.iconButton}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Header({
  title,
  right,
  onBack,
  hideBack,
  subtitle,
}: {
  title: string;
  right?: ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
  subtitle?: string;
}) {
  const design = useDesign();
  if (design)
    return (
      <View
        style={[
          S.header,
          { minHeight: 56, borderBottomWidth: 1, borderBottomColor: colors.primary[200] },
        ]}
      >
        <View style={{ width: 32 }}>
          {!hideBack && (
            <IconButton name="chevron-left" onPress={onBack ?? (() => back())} label="Quay lại" />
          )}
        </View>
        <View style={{ flex: 1 }}>
          {subtitle && (
            <T muted size={10}>
              {subtitle}
            </T>
          )}
          <T bold center={!subtitle} size={subtitle ? 16 : 18}>
            {title}
          </T>
        </View>
        <View style={{ minWidth: 32 }}>{right}</View>
      </View>
    );
  return (
    <View style={S.header}>
      <Row style={{ flex: 1, gap: 12 }}>
        {!hideBack && (
          <IconButton name="chevron-left" onPress={onBack ?? (() => back())} label="Quay lại" />
        )}
        <View style={{ flex: 1 }}>
          {subtitle && (
            <T muted size={10}>
              {subtitle}
            </T>
          )}
          <T bold size={18} style={{ lineHeight: 25 }}>
            {title}
          </T>
        </View>
      </Row>
      {right}
    </View>
  );
}
export function Screen({
  children,
  title,
  right,
  footer,
  tabs,
  onBack,
  hideBack,
  noPadding,
  scroll = true,
  subtitle,
}: PropsWithChildren<{
  title?: string;
  right?: ReactNode;
  footer?: ReactNode;
  tabs?: 'home' | 'skills' | 'classes' | 'profile';
  onBack?: () => void;
  hideBack?: boolean;
  noPadding?: boolean;
  scroll?: boolean;
  subtitle?: string;
}>) {
  return (
    <SafeAreaView style={S.safe} edges={['top', 'left', 'right']}>
      {Platform.OS === 'web' && (
        <Row between style={S.webStatus}>
          <T bold size={12}>
            9:41
          </T>
          <Row style={{ gap: 6 }}>
            <Icon name="bar-chart" size={13} />
            <Icon name="wifi" size={13} />
            <Icon name="battery" size={16} />
          </Row>
        </Row>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {title && (
          <Header
            title={title}
            right={right}
            onBack={onBack}
            hideBack={hideBack}
            subtitle={subtitle}
          />
        )}
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[S.content, noPadding && { padding: 0 }]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[S.content, { flex: 1 }, noPadding && { padding: 0 }]}>{children}</View>
        )}
        {footer && (
          <SafeAreaView edges={tabs ? [] : ['bottom']} style={S.footer}>
            {footer}
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>
      {tabs ? <BottomTabs active={tabs} /> : !footer && <SafeAreaView edges={['bottom']} />}
    </SafeAreaView>
  );
}
export function BottomTabs({ active }: { active: string }) {
  const design = useDesign();
  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        S.tabBar,
        design && {
          backgroundColor: colors.primary[100],
          borderTopWidth: 1,
          borderTopColor: colors.primary[200],
          minHeight: 68,
        },
      ]}
    >
      <Row between>
        {(
          [
            ['home', 'Trang chủ', 'home'],
            ['skills', 'Kỹ năng', 'grid'],
            ['classes', 'Lớp học', 'users'],
            ['profile', 'Cá nhân', 'user'],
          ] as const
        ).map(([id, legacyLabel, icon]) => {
          const label = design
            ? { home: 'Trang chủ', skills: 'Thư viện', classes: 'Lớp học', profile: 'Hồ sơ' }[id]
            : legacyLabel;
          return (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active === id }}
              onPress={() => go(id, {}, true)}
              style={S.tabTouch}
            >
              <View
                style={
                  design
                    ? { height: 28, justifyContent: 'center' }
                    : [S.tabCircle, { backgroundColor: active === id ? '#080808' : '#888' }]
                }
              >
                <Icon
                  name={design && id === 'skills' ? 'book-open' : icon}
                  color={
                    design ? (active === id ? colors.primary[800] : colors.primary[600]) : '#fff'
                  }
                  size={22}
                />
              </View>
              {design && (
                <T
                  size={10}
                  style={{ color: active === id ? colors.primary[800] : colors.primary[600] }}
                >
                  {label}
                </T>
              )}
            </Pressable>
          );
        })}
      </Row>
    </SafeAreaView>
  );
}
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  const design = useDesign();
  return (
    <Row between style={{ marginBottom: design ? 4 : 12 }}>
      <T bold size={design ? 18 : 17}>
        {title}
      </T>
      {action && onPress && (
        <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
          <T size={11} muted>
            {action}
          </T>
        </Pressable>
      )}
    </Row>
  );
}
export function Chips({
  options,
  value,
  onChange,
  small = false,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  small?: boolean;
}) {
  const palette = usePalette();
  const design = useDesign();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 6, paddingVertical: 3, paddingBottom: 14 }}
      style={{ flexGrow: 0 }}
    >
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: option === value }}
          onPress={() => onChange(option)}
          style={[
            S.chip,
            {
              paddingHorizontal: small ? 12 : 16,
              paddingVertical: small ? 6 : 8,
              borderRadius: 20,
              backgroundColor:
                option === value ? palette.strong : design ? themeColors.primaryLight : C.light,
            },
          ]}
        >
          <T
            size={small ? 12 : 13}
            bold={option === value}
            style={{
              color: option === value ? palette.white : design ? palette.strong : palette.ink,
            }}
          >
            {option}
          </T>
        </Pressable>
      ))}
    </ScrollView>
  );
}
export function Segments({
  options,
  value,
  onChange,
  variant = 'pill',
}: {
  variant?: 'pill' | 'underline';
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const design = useDesign();
  const palette = usePalette();
  if (design && variant === 'underline')
    return (
      <Row style={{ gap: 0, marginBottom: 12 }}>
        {options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: value === option }}
            onPress={() => onChange(option)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderBottomWidth: value === option ? 2 : 1,
              borderBottomColor: value === option ? palette.accent : palette.line,
            }}
          >
            <T size={12} style={{ color: value === option ? palette.strong : palette.ink }}>
              {option}
            </T>
          </Pressable>
        ))}
      </Row>
    );
  return (
    <Row style={[S.segments, design && { backgroundColor: palette.fill }]}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: value === option }}
          onPress={() => onChange(option)}
          style={[S.segment, value === option && { backgroundColor: palette.strong }]}
        >
          <T size={12} style={{ color: value === option ? palette.white : palette.ink }}>
            {option}
          </T>
        </Pressable>
      ))}
    </Row>
  );
}
export function Progress({
  value,
  label,
  height = 6,
}: {
  value: number;
  label?: string;
  height?: number;
}) {
  const palette = usePalette();
  const design = useDesign();
  const safe = Math.min(100, Math.max(0, value));
  return (
    <View style={{ gap: 6, flex: 1 }}>
      {label && (
        <Row between>
          <T size={11} muted>
            {label}
          </T>
          <T size={11} bold>
            {safe}%
          </T>
        </Row>
      )}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: safe }}
        style={{
          height,
          borderRadius: height,
          backgroundColor: design ? palette.fill : '#e8e8e8',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${safe}%`,
            backgroundColor: design ? palette.strong : '#343434',
            borderRadius: height,
          }}
        />
      </View>
    </View>
  );
}
export function Badge({ children, dark }: PropsWithChildren<{ dark?: boolean }>) {
  const design = useDesign();
  const palette = usePalette();
  const text = typeof children === 'string' ? children.toLowerCase() : '';
  const positive = design && /hoàn thành|mở khóa|đã tham gia/.test(text) && !/chưa/.test(text);
  const isSafety = design && /an toàn/.test(text);
  const isIndependence = design && /tự lập/.test(text);
  const isSocial = design && /xã hội/.test(text);
  const isHealth = design && /sức khỏe/.test(text);

  let bg = dark ? palette.strong : design ? palette.fill : '#eee';
  let color = dark ? '#fff' : design ? palette.strong : '#777';

  if (isSafety) {
    bg = '#FEF3C7';
    color = '#D97706';
  } else if (isIndependence) {
    bg = '#E8F8EE';
    color = '#16A34A';
  } else if (isSocial) {
    bg = '#F3E8FF';
    color = '#9333EA';
  } else if (isHealth) {
    bg = '#E0F2FE';
    color = '#0284C7';
  } else if (positive) {
    bg = '#E8F8EE';
    color = '#16A34A';
  }

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 3.5,
        borderRadius: 6,
        backgroundColor: bg,
        alignSelf: 'flex-start',
      }}
    >
      <T size={12} bold style={{ color }}>
        {children}
      </T>
    </View>
  );
}
export function Placeholder({
  label = 'IMAGE',
  height = 200,
  icon,
  dashed,
  style,
}: {
  label?: string;
  height?: number;
  icon?: string;
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const design = useDesign();
  const palette = usePalette();
  return (
    <View
      style={[
        S.placeholder,
        {
          minHeight: height,
          backgroundColor: design ? palette.fill : dashed ? '#fafafa' : C.fill,
          borderWidth: !design && dashed ? 1 : 0,
          borderColor: '#aaa',
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      {icon && !design && (
        <View style={S.placeholderIcon}>
          <Icon name={icon} size={30} color="#777" />
        </View>
      )}
      {(!design || label === 'IMAGE') && (
        <T size={dashed ? 10 : 13} muted={dashed}>
          {label}
        </T>
      )}
    </View>
  );
}
export function Avatar({ name, size = 42 }: { name?: string; size?: number }) {
  const design = useDesign();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: design ? colors.primary[200] : '#e6e6e6',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {name ? (
        <T size={size / 4} muted bold>
          {name
            .split(' ')
            .map((x) => x[0])
            .slice(-2)
            .join('')}
        </T>
      ) : (
        <Icon name="user" size={size * 0.5} color={design ? colors.primary[600] : '#888'} />
      )}
    </View>
  );
}
export function Field({
  label,
  required,
  iconLeft,
  iconRight,
  clearable,
  onClear,
  error,
  caption,
  onInfoPress,
  secureTextEntry,
  style,
  value,
  onChangeText,
  ...props
}: TextInputProps & {
  label?: string;
  required?: boolean;
  iconLeft?: string;
  iconRight?: string;
  clearable?: boolean;
  onClear?: () => void;
  error?: string;
  caption?: string;
  onInfoPress?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const design = useDesign();
  const fontFamily = useDesignFont();
  const palette = usePalette();
  const hasError = !!error;
  const showClear = clearable && !!value && !props.editable === false;

  return (
    <View style={{ gap: design ? 4 : 6, marginBottom: design ? 12 : 16 }}>
      {label && (
        <Row style={{ gap: 4 }}>
          <T
            size={design ? 14 : 13}
            bold={!design}
            style={hasError ? { color: themeColors.errorRed } : undefined}
          >
            {label}
          </T>
          {required && (
            <T size={design ? 14 : 13} bold style={{ color: themeColors.errorRed }}>
              *
            </T>
          )}
        </Row>
      )}
      <Row
        style={[
          S.inputWrap,
          design && {
            minHeight: 48,
            borderColor: hasError ? themeColors.errorRed : colors.neutral[300],
            borderRadius: radius.input,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 1,
          },
        ]}
      >
        {iconLeft && (
          <View style={{ paddingLeft: 12, paddingRight: 4 }}>
            <Icon
              name={iconLeft}
              size={18}
              color={hasError ? themeColors.errorRed : colors.neutral[400]}
            />
          </View>
        )}
        <TextInput
          accessibilityLabel={label ?? props.placeholder}
          placeholderTextColor={colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !visible}
          {...props}
          style={[
            S.input,
            design && {
              fontFamily,
              color: palette.ink,
              paddingHorizontal: iconLeft ? 8 : 12,
              paddingVertical: 12,
              minHeight: 46,
            },
            props.multiline && { minHeight: 86, textAlignVertical: 'top' },
            style,
          ]}
        />
        {showClear && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xóa nội dung"
            hitSlop={8}
            onPress={() => {
              onChangeText?.('');
              onClear?.();
            }}
            style={{ padding: 8 }}
          >
            <Icon name="x" size={16} color={colors.neutral[400]} />
          </Pressable>
        )}
        {secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            onPress={() => setVisible(!visible)}
            style={{ padding: 10 }}
          >
            <Icon
              name={visible ? 'eye-off' : 'eye'}
              size={18}
              color={design ? colors.primary[700] : '#888'}
            />
          </Pressable>
        )}
        {iconRight && !secureTextEntry && (
          <View style={{ paddingRight: 12, paddingLeft: 4 }}>
            <Icon name={iconRight} size={18} color={colors.neutral[400]} />
          </View>
        )}
        {onInfoPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Thông tin"
            hitSlop={8}
            onPress={onInfoPress}
            style={{ padding: 8, paddingRight: 12 }}
          >
            <Icon name="info" size={16} color={colors.neutral[400]} />
          </Pressable>
        )}
      </Row>
      {hasError ? (
        <T size={11} style={{ color: themeColors.errorRed, marginTop: 2 }}>
          {error}
        </T>
      ) : caption ? (
        <T muted size={11} style={{ marginTop: 2 }}>
          {caption}
        </T>
      ) : null}
    </View>
  );
}

export function Checkbox({
  label,
  caption,
  checked,
  onChange,
  disabled,
  accessibilityLabel,
}: {
  label?: string;
  caption?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      hitSlop={8}
      style={{ minHeight: 24, justifyContent: 'center', opacity: disabled ? 0.5 : 1 }}
    >
      <Row style={{ gap: 8, alignItems: caption ? 'flex-start' : 'center' }}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            borderWidth: 1,
            borderColor: checked ? palette.strong : palette.ink,
            backgroundColor: checked ? palette.strong : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: caption ? 2 : 0,
          }}
        >
          {checked && <Icon name="check" size={14} color="#fff" />}
        </View>
        {(!!label || !!caption) && (
          <View style={{ flex: 1 }}>
            {!!label && (
              <T size={12} style={{ color: palette.ink }}>
                {label}
              </T>
            )}
            {!!caption && (
              <T size={10} muted>
                {caption}
              </T>
            )}
          </View>
        )}
      </Row>
    </Pressable>
  );
}

export function SearchField({
  value,
  onChangeText,
  label = 'Tìm kiếm',
  placeholder = label,
  clearable = true,
}: {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}) {
  const palette = usePalette();
  const fontFamily = useDesignFont();
  return (
    <Row
      style={{
        height: 42,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: colors.primary[600],
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        gap: 8,
        marginBottom: 12,
        shadowColor: '#1989E2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Icon name="search" size={16} color={palette.accent} />
      <TextInput
        accessibilityLabel={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        returnKeyType="search"
        placeholderTextColor={colors.neutral[400]}
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 14,
          fontFamily,
          color: palette.ink,
          padding: 0,
          height: 38,
        }}
      />
      {clearable && !!value && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xóa tìm kiếm"
          hitSlop={8}
          onPress={() => onChangeText('')}
        >
          <Icon name="x" size={16} color={colors.neutral[400]} />
        </Pressable>
      )}
    </Row>
  );
}

export function MenuRow({
  icon,
  label,
  detail,
  onPress,
  children,
}: PropsWithChildren<{ icon?: string; label: string; detail?: string; onPress?: () => void }>) {
  const design = useDesign();
  const content = (
    <Row
      style={{
        minHeight: design ? 48 : 50,
        paddingVertical: 10,
        paddingHorizontal: design ? 10 : 0,
      }}
    >
      {icon && <Icon name={icon} size={19} color={design ? colors.primary[600] : '#888'} />}
      <T style={{ flex: 1 }}>{label}</T>
      {detail && (
        <T muted size={12}>
          {detail}
        </T>
      )}
      {children ??
        (onPress && (
          <Icon name="chevron-right" size={17} color={design ? colors.primary[600] : '#999'} />
        ))}
    </Row>
  );
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    <View>{content}</View>
  );
}
export function MenuGroup({ children }: PropsWithChildren) {
  const palette = usePalette();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: palette.line,
        backgroundColor: palette.light,
        borderRadius: radius.card,
        overflow: 'hidden',
      }}
    >
      {Children.toArray(children).map((child, index, list) => (
        <View
          key={index}
          style={{
            borderBottomWidth: index < list.length - 1 ? 1 : 0,
            borderBottomColor: palette.line,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
export function Stats({
  data,
}: {
  data: { value: string; label: string; onPress?: () => void }[];
}) {
  return (
    <Row style={{ gap: 8 }}>
      {data.map((item) => (
        <Card
          key={item.label}
          style={{ flex: 1, padding: 12, alignItems: 'center', gap: 4, borderRadius: 7 }}
          onPress={item.onPress}
        >
          <T bold size={21}>
            {item.value}
          </T>
          <T size={10} muted center>
            {item.label}
          </T>
        </Card>
      ))}
    </Row>
  );
}

export function StatsRow({
  completed = 12,
  inProgress = 3,
  notStarted = 5,
  onPressItem,
  style,
}: {
  completed?: number | string;
  inProgress?: number | string;
  notStarted?: number | string;
  onPressItem?: (status: 'completed' | 'inProgress' | 'notStarted') => void;
  style?: StyleProp<ViewStyle>;
}) {
  const items = [
    { key: 'completed' as const, label: 'Hoàn thành', value: completed },
    { key: 'inProgress' as const, label: 'Đang làm', value: inProgress },
    { key: 'notStarted' as const, label: 'Chưa bắt đầu', value: notStarted },
  ];
  return (
    <Row style={[{ gap: 8 }, style]}>
      {items.map((item) => (
        <Card
          key={item.key}
          label={`${item.label}: ${item.value}`}
          onPress={onPressItem ? () => onPressItem(item.key) : undefined}
          style={{
            flex: 1,
            paddingVertical: 14,
            paddingHorizontal: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: themeColors.primarySoft,
            borderColor: themeColors.primaryLight,
            borderRadius: radius.card,
            gap: 4,
          }}
        >
          <T bold size={20} style={{ color: themeColors.primaryNavy }}>
            {item.value}
          </T>
          <T size={11} muted center style={{ color: themeColors.textSecondary }}>
            {item.label}
          </T>
        </Card>
      ))}
    </Row>
  );
}

export function TabSegments({
  options = ['Tuần này', 'Tháng này', 'Tất cả'],
  value,
  onChange,
  style,
}: {
  options?: readonly string[];
  value: string;
  onChange: (option: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Row
      style={[
        {
          backgroundColor: themeColors.primarySoft,
          padding: 4,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: themeColors.primaryLight,
          gap: 4,
          marginBottom: 14,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = value === option;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option}
            onPress={() => onChange(option)}
            style={{
              flex: 1,
              borderRadius: 20,
              paddingVertical: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isSelected ? themeColors.primary : 'transparent',
            }}
          >
            <T
              bold={isSelected}
              size={12}
              style={{
                color: isSelected ? '#fff' : themeColors.primaryNavy,
              }}
            >
              {option}
            </T>
          </Pressable>
        );
      })}
    </Row>
  );
}

export function NotificationBanner({
  type = 'info',
  title,
  text,
  icon,
  onDismiss,
  style,
}: {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  text?: string;
  icon?: string;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const configs = {
    info: {
      bg: '#DDF2FF',
      border: '#8DCCF6',
      text: '#0F63A9',
      defaultIcon: 'info',
    },
    success: {
      bg: '#E0FDC1',
      border: '#A0E066',
      text: '#2E6007',
      defaultIcon: 'check-circle',
    },
    warning: {
      bg: '#FBE3B7',
      border: '#E6B65C',
      text: '#8A5300',
      defaultIcon: 'alert-triangle',
    },
    error: {
      bg: '#FFECEB',
      border: '#FFA39E',
      text: '#C5221F',
      defaultIcon: 'alert-circle',
    },
  };

  const config = configs[type];
  const iconName = icon ?? config.defaultIcon;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: config.bg,
          borderWidth: 1,
          borderColor: config.border,
          borderRadius: 12,
          padding: 12,
          gap: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={iconName} size={18} color={config.text} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <T bold size={13} style={{ color: config.text }}>
          {title}
        </T>
        {text && (
          <T size={11} style={{ color: config.text, opacity: 0.9 }}>
            {text}
          </T>
        )}
      </View>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng thông báo"
          hitSlop={8}
          onPress={onDismiss}
          style={{ padding: 4 }}
        >
          <Icon name="x" size={16} color={config.text} />
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  title,
  description,
  icon = 'inbox',
}: {
  title: string;
  description?: string;
  icon?: string;
}) {
  const palette = usePalette();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 46, gap: 12 }}>
      <View style={{ padding: 18, borderRadius: 50, backgroundColor: palette.fill }}>
        <Icon name={icon} size={28} color="#aaa" />
      </View>
      <T bold center>
        {title}
      </T>
      {description && (
        <T muted center size={12}>
          {description}
        </T>
      )}
    </View>
  );
}
export function Dialog({
  visible,
  title,
  description,
  children,
  onClose,
}: PropsWithChildren<{
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
}>) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={S.overlay}>
        <Pressable
          accessibilityLabel="Đóng hộp thoại"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View accessibilityViewIsModal style={S.dialog}>
          <T bold size={18}>
            {title}
          </T>
          {description && (
            <T muted size={13}>
              {description}
            </T>
          )}
          <ButtonSizeContext.Provider value="medium">{children}</ButtonSizeContext.Provider>
        </View>
      </View>
    </Modal>
  );
}
export function Notice({
  title,
  description,
  visible,
  onClose,
}: {
  title: string;
  description: string;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog visible={visible} title={title} description={description} onClose={onClose}>
      <Button label="Đã hiểu" onPress={onClose} />
    </Dialog>
  );
}
export function Radio({
  label,
  selected,
  onPress,
  description,
  disabled,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  disabled?: boolean;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={{ paddingVertical: 8, opacity: disabled ? 0.5 : 1 }}
    >
      <Row style={{ alignItems: description ? 'flex-start' : 'center', gap: 10 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: selected ? 2 : 1,
            borderColor: selected ? themeColors.primary : palette.ink,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: description ? 2 : 0,
          }}
        >
          {selected && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: themeColors.primary,
              }}
            />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <T size={13} bold={selected} style={{ color: palette.ink }}>
            {label}
          </T>
          {description && (
            <T muted size={11} style={{ marginTop: 2 }}>
              {description}
            </T>
          )}
        </View>
      </Row>
    </Pressable>
  );
}
export function MascotArt({ size = 210 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 220 220" accessibilityLabel="Ngôi sao cô đơn">
      <Path
        d="M99 30 Q110 9 122 32 L145 77 L194 82 Q216 85 201 102 L166 135 L174 183 Q178 204 157 196 L111 174 L67 196 Q46 207 51 183 L59 136 L24 105 Q6 86 31 82 L78 78 Z"
        fill="#fff"
        stroke="#171717"
        strokeWidth="3"
      />
      <Path
        d="M89 186 L87 211 Q104 217 110 208 L111 177 M121 181 L126 211 Q143 216 145 207 L140 186"
        fill="#fff"
        stroke="#171717"
        strokeWidth="3"
      />
      <Circle cx="91" cy="118" r="5" fill="#111" />
      <Circle cx="132" cy="118" r="5" fill="#111" />
      <Path
        d="M103 127 Q109 139 115 128 Q120 137 126 126"
        fill="none"
        stroke="#111"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="81" cy="135" r="9" fill="#fff" stroke="#333" strokeWidth="2" />
      <Circle cx="141" cy="135" r="9" fill="#fff" stroke="#333" strokeWidth="2" />
      <Path d="M114 36 L119 43" stroke="#222" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
export const S = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingTop: 14, paddingBottom: 28, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  card: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    minHeight: 58,
    paddingVertical: 10,
  },
  iconButton: { minWidth: 28, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
  webStatus: { height: 32, paddingHorizontal: 24, backgroundColor: '#fff' },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#fff',
    gap: 10,
  },
  tabBar: { backgroundColor: '#d9d9d9', paddingHorizontal: 8, paddingTop: 8, paddingBottom: 6 },
  tabTouch: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  tabCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: { borderRadius: 24 },
  segments: { backgroundColor: '#f0f0f0', padding: 4, borderRadius: 24, gap: 4, marginBottom: 18 },
  segment: { flex: 1, borderRadius: 20, paddingVertical: 9, alignItems: 'center' },
  placeholder: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  placeholderIcon: { padding: 12, borderRadius: 40, borderWidth: 1, borderColor: '#aaa' },
  inputWrap: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 7,
    minHeight: 50,
    gap: 0,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: C.ink,
    minHeight: 48,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    padding: 22,
    gap: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 350,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  divider: { height: 1, backgroundColor: '#ededed', marginVertical: 12 },
});
