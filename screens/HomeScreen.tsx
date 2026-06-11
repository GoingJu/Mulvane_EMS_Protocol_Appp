import { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CATEGORIES, SEARCH_INDEX, SearchHit } from '../data/protocols';
import SearchBar from '../components/SearchBar';
import { theme } from '../theme';

type Props = {
  onOpenCategory: (categoryId: string) => void;
  onOpenProtocol: (protocolId: string) => void;
};

export default function HomeScreen({ onOpenCategory, onOpenProtocol }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter((h) =>
      h.protocol.title.toLowerCase().includes(q),
    ).slice(0, 30);
  }, [query]);

  const searching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Official Mulvane EMS logo (extracted from the protocols PDF) */}
      <View style={styles.logoBox}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoSub}>Field Protocols</Text>
      </View>

      <SearchBar value={query} onChange={setQuery} />

      {searching ? (
        <FlatList
          style={styles.list}
          data={results}
          keyExtractor={(h) => h.protocol.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>No protocols match “{query}”.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultRow}
              onPress={() => onOpenProtocol(item.protocol.id)}
            >
              <Text style={styles.resultTitle}>{item.protocol.title}</Text>
              <Text style={styles.resultMeta}>
                {item.categoryTitle}
                {item.sectionTitle ? ` · ${item.sectionTitle}` : ''}
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          style={styles.list}
          data={CATEGORIES}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.categoryCard, { backgroundColor: item.accent }]}
              onPress={() => onOpenCategory(item.id)}
            >
              <Text style={styles.categoryTitle}>{item.title}</Text>
              {item.subtitle ? (
                <Text style={styles.categorySub}>{item.subtitle}</Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.space(4) },
  logoBox: { alignItems: 'center', paddingVertical: theme.space(5) },
  logo: { width: 110, aspectRatio: 1374 / 891 },
  logoSub: { fontSize: 15, color: theme.colors.muted, marginTop: theme.space(2) },
  list: { marginTop: theme.space(4) },
  categoryCard: {
    borderRadius: theme.radius,
    padding: theme.space(5),
    marginBottom: theme.space(3),
  },
  categoryTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  categorySub: { color: '#ffffffcc', fontSize: 14, marginTop: theme.space(1) },
  resultRow: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.space(4),
    marginBottom: theme.space(2),
  },
  resultTitle: { fontSize: 17, fontWeight: '600', color: theme.colors.text },
  resultMeta: { fontSize: 13, color: theme.colors.muted, marginTop: theme.space(1) },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.space(6) },
});
