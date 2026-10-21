import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoProvider } from '../state/demo';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DemoProvider>
        <View style={{ flex: 1, backgroundColor: '#e8e8e8', alignItems: 'center' }}>
          <View
            style={{
              flex: 1,
              width: '100%',
              maxWidth: Platform.OS === 'web' ? 430 : undefined,
              backgroundColor: '#fff',
            }}
          >
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fff' },
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
              }}
            />
          </View>
        </View>
      </DemoProvider>
    </SafeAreaProvider>
  );
}
