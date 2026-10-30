import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, themeColors } from '../design-system/tokens';
import { useDesignFont } from '../design-system/theme';

export function BrandLogo({ width = 200, outline = false }: { width?: number; outline?: boolean }) {
  return (
    <Image
      accessibilityLabel="LifeLab"
      source={
        outline
          ? require('../../assets/figma/lifelab-wordmark-outline.png')
          : require('../../assets/figma/lifelab-wordmark.png')
      }
      resizeMode="contain"
      style={{ width, height: width * (outline ? 390 / 1017 : 306 / 931), alignSelf: 'center' }}
    />
  );
}

export function StepProgress({ step }: { step: 1 | 2 }) {
  return (
    <View
      accessibilityLabel={`Bước ${step} trên 2`}
      style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}
    >
      {[1, 2].map((value) => (
        <View
          key={value}
          style={{
            height: 8,
            borderRadius: 4,
            flex: 1,
            backgroundColor: value <= step ? colors.primary[500] : colors.primary[200],
          }}
        />
      ))}
    </View>
  );
}

// One native input retains selection, paste, autofill and backspace behavior across six visual cells.
export function OtpField({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (value: string) => void;
  error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const fontFamily = useDesignFont();
  return (
    <View style={{ position: 'relative', height: 48 }}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ flexDirection: 'row', gap: 8, height: 48 }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              minWidth: 0,
              borderWidth: 1.5,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              borderColor: error
                ? themeColors.errorRed
                : focused && i === Math.min(value.length, 5)
                  ? colors.primary[700]
                  : value[i]
                    ? colors.primary[600]
                    : colors.neutral[300],
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Text
              testID="otp-digit"
              style={{ fontFamily, fontSize: 20, color: colors.primary[900] }}
            >
              {value[i] || ''}
            </Text>
          </View>
        ))}
      </View>
      <TextInput
        accessibilityLabel="Mã xác thực"
        value={value}
        onChangeText={(v) => onChangeText(v.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={6}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          StyleSheet.absoluteFill,
          {
            color: 'transparent',
            backgroundColor: 'transparent',
            fontSize: 20,
            fontFamily,
            padding: 0,
          },
        ]}
        caretHidden
      />
    </View>
  );
}
