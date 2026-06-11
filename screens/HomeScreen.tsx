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
import { PROTOCOL_TEXT } from '../data/searchText';
import SearchBar from '../components/SearchBar';
import { theme } from '../theme';

type Snippet = { before: string; match: string; after: string };
type Result = { hit: SearchHit; snippet: Snippet | null };

// Build a short highlighted excerpt around the first match of `q` in `body`.
function makeSnippet(body: string, q: string): Snippet | null {
  const i = body.toLowerCase().indexOf(q);
  if (i < 0) return null;
  const radius = 40;
  const start = Math.max(0, i - radius);
  const end = Math.min(body.length, i + q.length + radius);
  return {
    before: (start > 0 ? '… ' : '') + body.slice(start, i),
    match: body.slice(i, i + q.length),
    after: body.slice(i + q.length, end) + (end < body.length ? ' …' : ''),
  };
}

type Props = {
  onOpenCategory: (categoryId: string) => void;
  onOpenProtocol: (protocolId: string) => void;
};

export default function HomeScreen({ onOpenCategory, onOpenProtocol }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const titleHits: Result[] = [];
    const bodyHits: Result[] = [];
    for (const hit of SEARCH_INDEX) {
      if (hit.protocol.title.toLowerCase().includes(q)) {
        titleHits.push({ hit, snippet: null });
        continue;
      }
      const snippet = makeSnippet(PROTOCOL_TEXT[hit.protocol.id] ?? '', q);
      if (snippet) bodyHits.push({ hit, snippet });
    }
    // Title matches first, then in-protocol (body) matches.
    return [...titleHits, ...bodyHits].slice(0, 40);
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
          keyExtractor={(r) => r.hit.protocol.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>No protocols match “{query}”.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultRow}
              onPress={() => onOpenProtocol(item.hit.protocol.id)}
            >
              <Text style={styles.resultTitle}>{item.hit.protocol.title}</Text>
              <Text style={styles.resultMeta}>
                {item.hit.categoryTitle}
                {item.hit.sectionTitle ? ` · ${item.hit.sectionTitle}` : ''}
              </Text>
              {item.snippet && (
                <Text style={styles.snippet} numberOfLines={2}>
                  {item.snippet.before}
                  <Text style={styles.snippetMatch}>{item.snippet.match}</Text>
                  {item.snippet.after}
                </Text>
              )}
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
  logo: { width: 92, height: 74 },
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
  snippet: { fontSize: 13, color: theme.colors.muted, marginTop: theme.space(2), lineHeight: 18 },
  snippetMatch: { backgroundColor: '#fde68a', color: '#111827', fontWeight: '700' },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.space(6) },
});
