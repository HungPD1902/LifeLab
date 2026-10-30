import { useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button, Checkbox, Field, Gap, Icon, Notice, Row, Screen, T, TextButton } from '../components/ui';
import { BrandLogo, OtpField, StepProgress } from '../components/brand';
import { go } from '../navigation';
import type { ScreenId } from '../data/screens';
import { useDemo } from '../state/demo';
import { DEMO_ACCOUNT, DEMO_OTP } from '../data/demo-account';
import { colors, themeColors } from '../design-system/tokens';

export function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => go('onboarding-1', {}, true), 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bắt đầu LifeLab"
          onPress={() => go('onboarding-1', {}, true)}
        >
          <BrandLogo width={240} />
        </Pressable>
      </View>
    </Screen>
  );
}

function SourceArtwork({ size = 318 }: { size?: number }) {
  return (
    <Image
      source={require('../../assets/figma/onboarding-image-source.png')}
      accessibilityLabel="Ảnh minh họa đang chờ thiết kế"
      resizeMode="cover"
      style={{
        width: '100%',
        maxWidth: size,
        aspectRatio: 1,
        alignSelf: 'center',
        borderRadius: 12,
      }}
    />
  );
}
function AuthHeading({ title }: { title: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <T size={28} center>
        {title}
      </T>
      <BrandLogo />
    </View>
  );
}

export function AuthScreen({ id }: { id: ScreenId }) {
  const demo = useDemo();
  const [name, setName] = useState(demo.name);
  const [email, setEmail] = useState(id === 'login' ? '' : demo.email);
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(demo.registrationPhone);
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [socialProvider, setSocialProvider] = useState('');
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  if (id.startsWith('onboarding-')) {
    const step = Number(id.split('-')[1]);
    return (
      <Screen
        scroll={false}
        footer={
          <>
            <Row style={{ justifyContent: 'center', gap: 8, marginBottom: 18 }}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === step ? colors.primary[800] : colors.primary[200],
                  }}
                />
              ))}
            </Row>
            <Row>
              {step < 3 ? (
                <>
                  <Button
                    label="Bỏ qua"
                    variant="outline"
                    style={{ flex: 1 }}
                    onPress={() => go('login', {}, true)}
                  />
                  <Button
                    label="Tiếp theo"
                    style={{ flex: 1 }}
                    onPress={() => go(`onboarding-${step + 1}` as ScreenId, {}, true)}
                  />
                </>
              ) : (
                <Button
                  label="Bắt đầu ngay"
                  style={{ flex: 1 }}
                  onPress={() => go('login', {}, true)}
                />
              )}
            </Row>
          </>
        }
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <SourceArtwork size={350} />
        </View>
      </Screen>
    );
  }
  if (id === 'signup-success')
    return (
      <Screen footer={<Button label="Bắt đầu học" onPress={() => go('login', {}, true)} />}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: themeColors.successGreen,
              borderWidth: 3,
              borderColor: themeColors.successText,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="check" size={48} color={themeColors.successText} />
          </View>
          <T size={26} bold center style={{ color: themeColors.primaryDark }}>
            Đăng ký thành công!
          </T>
          <T center muted size={14} style={{ maxWidth: 280, lineHeight: 20 }}>
            Chào mừng bạn đến với LifeLab. Hãy sẵn sàng cùng Mascot học thêm nhiều kỹ năng bổ ích!
          </T>
        </View>
      </Screen>
    );
  if (id === 'forgot-password')
    return (
      <Screen title="Quên mật khẩu">
        <Gap size={40} />
        <T bold size={24}>
          Đặt lại mật khẩu
        </T>
        <Gap />
        <T muted>Nhập email để xem bước xác thực.</T>
        <Gap size={8} />
        <T muted size={12}>
          Tài khoản demo dùng mật khẩu cố định; luồng này không đổi mật khẩu.
        </T>
        <Gap size={24} />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          label="Tiếp tục"
          onPress={() => {
            demo.setEmail(email.trim() || demo.email);
            go('verify', { mode: 'reset' });
          }}
        />
      </Screen>
    );
  if (id === 'verify')
    return (
      <Screen>
        <Gap size={14} />
        <StepProgress step={2} />
        <AuthHeading title="Xác thực" />
        <T center>
          {mode === 'reset'
            ? 'Nhập mã xác thực được gửi đến email của bạn'
            : 'Nhập mã xác thực gồm 6 số được gửi đến số điện thoại của bạn'}
        </T>
        <Gap size={8} />
        <T center>{mode === 'reset' ? demo.email : maskPhoneNumber(demo.registrationPhone)}</T>
        <Gap size={28} />
        <OtpField
          value={otp}
          error={!!otpError}
          onChangeText={(value) => {
            setOtp(value);
            setOtpError('');
          }}
        />
        {!!otpError && (
          <>
            <Gap size={10} />
            <T center size={12} style={{ color: themeColors.errorRed }}>
              {otpError}
            </T>
          </>
        )}
        <Gap size={16} />
        <Row style={{ justifyContent: 'center' }}>
          <TextButton label={sent ? 'Đã gửi lại mã' : 'Gửi lại mã'} onPress={() => setSent(true)} />
          <T muted size={12}>
            {sent ? '00:59' : '00:30'}
          </T>
        </Row>
        <Gap size={20} />
        <Button
          label="Xác nhận"
          onPress={() => {
            if (otp !== DEMO_OTP) {
              setOtpError('Mã xác thực không đúng.');
              return;
            }
            setOtp('');
            setOtpError('');
            go(mode === 'reset' ? 'login' : 'signup-success', {}, true);
          }}
        />
      </Screen>
    );
  const register = id === 'register';
  return (
    <Screen>
      <Gap size={register ? 14 : 28} />
      {register && <StepProgress step={1} />}
      <AuthHeading title={register ? 'Đăng ký' : 'Đăng nhập'} />
      {register && (
        <Field
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      )}
      <Field
        label={register ? 'Email' : 'Email / Số điện thoại'}
        accessibilityLabel="Email"
        placeholder={register ? 'Nhập email của bạn' : 'Nhập email hoặc số điện thoại'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setLoginError('');
        }}
        autoComplete="email"
      />
      {register && (
        <Field
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          value={name}
          onChangeText={setName}
          autoComplete="name"
        />
      )}
      <Field
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setLoginError('');
        }}
        autoComplete="off"
      />
      {register && (
        <Field
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          autoComplete="off"
        />
      )}
      {register ? (
        <View style={{ marginBottom: 16 }}>
          <Checkbox
            accessibilityLabel="Đồng ý điều khoản"
            label="Tôi đồng ý với Điều khoản và Chính sách bảo mật."
            checked={agreed}
            onChange={setAgreed}
          />
        </View>
      ) : (
        <Row style={{ justifyContent: 'flex-end', marginBottom: 16 }}>
          <TextButton label="Quên mật khẩu?" onPress={() => go('forgot-password')} />
        </Row>
      )}
      {!register && !!loginError && (
        <>
          <T style={{ color: themeColors.errorRed }} size={13}>
            {loginError}
          </T>
          <Gap size={12} />
        </>
      )}
      <Button
        label={register ? 'Đăng ký' : 'Đăng nhập'}
        onPress={() => {
          if (register) {
            demo.setName(name.trim() || DEMO_ACCOUNT.name);
            demo.setEmail(email.trim() || DEMO_ACCOUNT.email);
            demo.setRegistrationPhone(phone);
            go('verify');
            return;
          }
          if (
            email.trim().toLowerCase() !== DEMO_ACCOUNT.email ||
            password !== DEMO_ACCOUNT.password
          ) {
            setLoginError('Email hoặc mật khẩu không đúng.');
            return;
          }
          setPassword('');
          setLoginError('');
          demo.setName(DEMO_ACCOUNT.name);
          demo.setEmail(DEMO_ACCOUNT.email);
          go('home', {}, true);
        }}
      />
      {!register && (
        <>
          <Gap size={24} />
          <Row>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.primary[200] }} />
            <T muted size={12}>
              Hoặc tiếp tục với
            </T>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.primary[200] }} />
          </Row>
          <Gap size={16} />
          <Button
            variant="outline"
            label="Tiếp tục với Google"
            icon="globe"
            onPress={() => setSocialProvider('Google')}
          />
          <Gap size={12} />
          <Button
            variant="outline"
            label="Tiếp tục với Apple"
            icon="smartphone"
            onPress={() => setSocialProvider('Apple')}
          />
        </>
      )}
      <View style={{ flex: 1, minHeight: 24 }} />
      <Row style={{ justifyContent: 'center', gap: 6 }}>
        <T size={12} muted>
          {register ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
        </T>
        <TextButton
          label={register ? 'Đăng nhập' : 'Đăng ký'}
          onPress={() => go(register ? 'login' : 'register', {}, true)}
        />
      </Row>
      <Notice
        visible={!!socialProvider}
        title={`Đăng nhập với ${socialProvider}`}
        description="Vui lòng dùng tài khoản demo bằng email và mật khẩu."
        onClose={() => setSocialProvider('')}
      />
    </Screen>
  );
}
function maskPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits.length) return '******';
  const visibleCount = Math.min(4, digits.length - 1);
  return (
    '*'.repeat(digits.length - visibleCount) + (visibleCount ? digits.slice(-visibleCount) : '')
  );
}
