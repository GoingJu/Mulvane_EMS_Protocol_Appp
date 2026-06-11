import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import ProtocolScreen from './screens/ProtocolScreen';
import { theme } from './theme';

// Minimal, dependency-free navigation via app state. This keeps the first
// milestone runnable with zero extra packages; we can swap in Expo Router
// later without touching the screen components.
type Nav =
  | { screen: 'home' }
  | { screen: 'category'; categoryId: string }
  | { screen: 'protocol'; protocolId: string; from: Nav };

export default function App() {
  const [nav, setNav] = useState<Nav>({ screen: 'home' });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
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
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});
