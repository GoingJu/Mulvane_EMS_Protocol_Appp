import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ProtocolScreen from './screens/ProtocolScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Minimal, dependency-free navigation via app state. This keeps the first
// milestone runnable with zero extra packages; we can swap in Expo Router
// later without touching the screen components.
type Nav =
  | { screen: 'home' }
  | { screen: 'category'; categoryId: string }
  | { screen: 'protocol'; protocolId: string; from: Nav };

function AppShell() {
  const [nav, setNav] = useState<Nav>({ screen: 'home' });
  const { mode, colors } = useTheme();

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: colors.bg }]}>
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {nav.screen === 'home' && (
        <HomeScreen
          onOpenCategory={(categoryId) => setNav({ screen: 'category', categoryId })}
          onOpenProtocol={(protocolId) =>
            setNav({ screen: 'protocol', protocolId, from: nav })
          }
        />
      )}
      {nav.screen === 'category' && (
        <CategoryScreen
          categoryId={nav.categoryId}
          onBack={() => setNav({ screen: 'home' })}
          onOpenProtocol={(protocolId) =>
            setNav({ screen: 'protocol', protocolId, from: nav })
          }
        />
      )}
      {nav.screen === 'protocol' && (
        <ProtocolScreen
          protocolId={nav.protocolId}
          onBack={() => setNav(nav.from)}
        />
      )}
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
