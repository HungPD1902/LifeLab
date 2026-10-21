import { Feather } from '@expo/vector-icons';
import { ComponentProps, PropsWithChildren, ReactNode, useState } from 'react';
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

export const C = {
  ink: '#202020',
  muted: '#858585',
  line: '#dedede',
  light: '#f5f5f5',
  fill: '#d9d9d9',
  white: '#fff',
};
export type IconName = ComponentProps<typeof Feather>['name'];
export function Icon({
  name,
  size = 20,
  color = C.ink,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return <Feather name={name as IconName} size={size} color={color} />;
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
  return (
    <Text
      style={[
        {
          fontSize: size,
          lineHeight: size * 1.45,
          color: muted ? C.muted : C.ink,
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
  if (onPress)
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [S.card, pressed && { opacity: 0.65 }, style]}
      >
        {children}
      </Pressable>
    );
  return <View style={[S.card, style]}>{children}</View>;
}
export function Button({
  label,
  onPress,
  variant = 'primary',
  small,
  icon,
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'soft';
  small?: boolean;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        S.button,
        {
          backgroundColor: variant === 'primary' ? C.ink : variant === 'soft' ? C.fill : C.white,
          borderColor: variant === 'outline' ? C.line : 'transparent',
          minHeight: small ? 34 : 52,
          paddingHorizontal: small ? 12 : 18,
        },
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.65 },
        style,
      ]}
    >
      {icon && (
        <Icon name={icon} size={small ? 14 : 18} color={variant === 'primary' ? C.white : C.ink} />
      )}
      <T bold size={small ? 12 : 15} style={{ color: variant === 'primary' ? C.white : C.ink }}>
        {label}
      </T>
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
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={{ paddingVertical: 5 }}
    >
      <T bold muted={muted}>
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
  return (
    <SafeAreaView edges={['bottom']} style={S.tabBar}>
      <Row between>
        {(
          [
            ['home', 'Trang chủ', 'home'],
            ['skills', 'Kỹ năng', 'grid'],
            ['classes', 'Lớp học', 'users'],
            ['profile', 'Cá nhân', 'user'],
          ] as const
        ).map(([id, label, icon]) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: active === id }}
            onPress={() => go(id, {}, true)}
            style={S.tabTouch}
          >
            <View style={[S.tabCircle, { backgroundColor: active === id ? '#080808' : '#888' }]}>
              <Icon name={icon} color="#fff" size={22} />
            </View>
          </Pressable>
        ))}
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
  return (
    <Row between style={{ marginBottom: 12 }}>
      <T bold size={17}>
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
              paddingHorizontal: small ? 10 : 12,
              paddingVertical: small ? 7 : 9,
              backgroundColor: option === value ? C.ink : C.light,
            },
          ]}
        >
          <T size={small ? 11 : 12} style={{ color: option === value ? C.white : C.ink }}>
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
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Row style={S.segments}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityState={{ selected: value === option }}
          onPress={() => onChange(option)}
          style={[S.segment, value === option && { backgroundColor: C.ink }]}
        >
          <T size={12} style={{ color: value === option ? C.white : C.ink }}>
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
        style={{ height, borderRadius: height, backgroundColor: '#e8e8e8', overflow: 'hidden' }}
      >
        <View
          style={{
            height: '100%',
            width: `${safe}%`,
            backgroundColor: '#343434',
            borderRadius: height,
          }}
        />
      </View>
    </View>
  );
}
export function Badge({ children, dark }: PropsWithChildren<{ dark?: boolean }>) {
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        backgroundColor: dark ? C.ink : '#eee',
        alignSelf: 'flex-start',
      }}
    >
      <T size={10} bold style={{ color: dark ? '#fff' : '#777' }}>
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
  return (
    <View
      style={[
        S.placeholder,
        {
          minHeight: height,
          backgroundColor: dashed ? '#fafafa' : C.fill,
          borderWidth: dashed ? 1 : 0,
          borderColor: '#aaa',
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    >
      {icon && (
        <View style={S.placeholderIcon}>
          <Icon name={icon} size={30} color="#777" />
        </View>
      )}
      <T size={dashed ? 10 : 13} muted={dashed}>
        {label}
      </T>
    </View>
  );
}
export function Avatar({ name, size = 42 }: { name?: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#e6e6e6',
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
        <Icon name="user" size={size * 0.5} color="#888" />
      )}
    </View>
  );
}
export function Field({
  label,
  secureTextEntry,
  style,
  ...props
}: TextInputProps & { label?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      {label && (
        <T size={13} bold>
          {label}
        </T>
      )}
      <Row style={S.inputWrap}>
        <TextInput
          accessibilityLabel={label ?? props.placeholder}
          placeholderTextColor="#aaa"
          {...props}
          secureTextEntry={secureTextEntry && !visible}
          style={[S.input, props.multiline && { minHeight: 86, textAlignVertical: 'top' }, style]}
        />
        {secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            onPress={() => setVisible(!visible)}
            style={{ padding: 12 }}
          >
            <Icon name={visible ? 'eye-off' : 'eye'} size={18} color="#888" />
          </Pressable>
        )}
      </Row>
    </View>
  );
}
export function MenuRow({
  icon,
  label,
  detail,
  onPress,
  children,
}: PropsWithChildren<{ icon?: string; label: string; detail?: string; onPress?: () => void }>) {
  const content = (
    <Row style={{ minHeight: 50, paddingVertical: 10 }}>
      {icon && <Icon name={icon} size={19} color="#888" />}
      <T style={{ flex: 1 }}>{label}</T>
      {detail && (
        <T muted size={12}>
          {detail}
        </T>
      )}
      {children ?? (onPress && <Icon name="chevron-right" size={17} color="#999" />)}
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
export function Empty({
  title,
  description,
  icon = 'inbox',
}: {
  title: string;
  description?: string;
  icon?: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 46, gap: 12 }}>
      <View style={{ padding: 18, borderRadius: 50, backgroundColor: C.light }}>
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
          {children}
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
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={{ paddingVertical: 10 }}
    >
      <Row>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: '#999',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && (
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.ink }} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <T>{label}</T>
          {description && (
            <T muted size={10}>
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
