import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  Button,
  C,
  Field,
  Gap,
  Icon,
  IconButton,
  Notice,
  Placeholder,
  Row,
  Screen,
  T,
  TextButton,
} from '../components/ui';
import { go, back } from '../navigation';
import type { ScreenId } from '../data/screens';
import { useDemo } from '../state/demo';
import { DEMO_ACCOUNT, DEMO_OTP } from '../data/demo-account';

export function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => go('onboarding-1', {}, true), 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bắt đầu LifeLab"
          onPress={() => go('onboarding-1', {}, true)}
        >
          <View
            style={{
              width: 154,
              height: 154,
              borderRadius: 77,
              backgroundColor: '#d9d9d9',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T size={25} bold>
              LifeLab
            </T>
          </View>
        </Pressable>
      </View>
    </Screen>
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
            <Row style={{ justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    width: i === step ? 10 : 8,
                    height: i === step ? 10 : 8,
                    borderRadius: 5,
                    backgroundColor: i === step ? C.ink : '#ccc',
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
          <Placeholder height={340} style={{ aspectRatio: 1, borderRadius: 22 }} />
        </View>
      </Screen>
    );
  }
  if (id === 'signup-success')
    return (
      <Screen
        scroll={false}
        footer={<Button label="Bắt đầu học" onPress={() => go('login', {}, true)} />}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              width: 110,
              height: 110,
              borderRadius: 55,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon name="check" size={48} />
          </View>
          <T size={23} bold center>
            Đăng ký thành công!
          </T>
          <T center muted>
            Chào mừng bạn đến với LifeLab.
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
      <Screen
        title="Xác thực"
        onBack={() => back('register')}
        footer={
          <Button
            label="Xác nhận"
            onPress={() => {
              if (otp !== DEMO_OTP) {
                setOtpError('Mã xác thực không đúng.');
                return;
              }
              setOtp('');
              setOtpError('');
              if (mode === 'reset') go('login', {}, true);
              else go('signup-success', {}, true);
            }}
          />
        }
      >
        <Gap size={34} />
        <Brand />
        <Gap size={36} />
        <T size={26} bold center>
          Xác thực
        </T>
        <Gap />
        <T center muted>
          {mode === 'reset'
            ? 'Nhập mã xác thực được gửi đến email của bạn'
            : 'Nhập mã xác thực gồm 6 số được gửi đến số điện thoại của bạn'}
        </T>
        <Gap size={8} />
        <T center bold>
          {mode === 'reset' ? demo.email : maskPhoneNumber(demo.registrationPhone)}
        </T>
        <Gap size={28} />
        <TextInput
          accessibilityLabel="Mã xác thực"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={(value) => {
            setOtp(value.replace(/\D/g, ''));
            setOtpError('');
          }}
          placeholder="— — — — — —"
          placeholderTextColor="#bbb"
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            minHeight: 60,
            textAlign: 'center',
            letterSpacing: 13,
            fontSize: 23,
          }}
        />
        {!!otpError && (
          <>
            <Gap size={10} />
            <T center size={13} style={{ color: '#a52a2a' }}>
              {otpError}
            </T>
          </>
        )}
        <Gap />
        <Row style={{ justifyContent: 'center' }}>
          <TextButton label={sent ? 'Đã gửi lại mã' : 'Gửi lại mã'} onPress={() => setSent(true)} />
          <T muted size={12}>
            {sent ? '00:59' : '00:30'}
          </T>
        </Row>
      </Screen>
    );
  const register = id === 'register';
  return (
    <Screen onBack={() => back('onboarding-3')}>
      <View style={{ alignSelf: 'flex-start' }}>
        <IconButton name="chevron-left" label="Quay lại" onPress={() => back('onboarding-3')} />
      </View>
      <Gap size={18} />
      <T size={28} bold center>
        {register ? 'Đăng ký' : 'Đăng nhập'}
      </T>
      <Gap />
      <Brand />
      <Gap size={32} />
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
        label="Email"
        placeholder="Nhập email của bạn"
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
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
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
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Đồng ý điều khoản"
          accessibilityState={{ checked: agreed }}
          onPress={() => setAgreed(!agreed)}
          style={{ marginBottom: 20 }}
        >
          <Row>
            <View
              style={{
                width: 18,
                height: 18,
                borderWidth: 1,
                borderColor: '#999',
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {agreed && <Icon name="check" size={14} />}
            </View>
            <T size={11}>Tôi đồng ý với Điều khoản và Chính sách bảo mật.</T>
          </Row>
        </Pressable>
      ) : (
        <Row style={{ justifyContent: 'flex-end', marginBottom: 20 }}>
          <TextButton label="Quên mật khẩu?" onPress={() => go('forgot-password')} />
        </Row>
      )}
      {!register && !!loginError && (
        <>
          <T style={{ color: '#a52a2a' }} size={13}>
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
          <Gap size={26} />
          <Row>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
            <T muted size={12}>
              Hoặc đăng nhập với
            </T>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ddd' }} />
          </Row>
          <Gap />
          <Button
            variant="outline"
            label="Tiếp tục với Google"
            icon="globe"
            onPress={() => setSocialProvider('Google')}
          />
          <Gap size={10} />
          <Button
            variant="outline"
            label="Tiếp tục với Apple"
            icon="smartphone"
            onPress={() => setSocialProvider('Apple')}
          />
        </>
      )}
      <Gap size={30} />
      <Row style={{ justifyContent: 'center' }}>
        <T muted>{register ? 'Đã có tài khoản?' : 'Bạn chưa có tài khoản?'}</T>
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
  // Keep at least the first digit hidden, even for short demo input.
  const visibleCount = Math.min(4, digits.length - 1);
  return (
    '*'.repeat(digits.length - visibleCount) + (visibleCount ? digits.slice(-visibleCount) : '')
  );
}

function Brand() {
  return (
    <View
      style={{
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#eee',
      }}
    >
      <T bold size={18}>
        LifeLab
      </T>
    </View>
  );
}
