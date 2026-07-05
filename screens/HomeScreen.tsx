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
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';

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
  const { colors, space, radius, mode, toggle } = useTheme();
  const styles = useMemo(() => makeStyles(colors, space, radius), [colors, space, radius]);

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
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        {/* Official Mulvane EMS logo (extracted from the protocols PDF) */}
        <View style={styles.logoBox}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoSub}>Field Protocols</Text>
        </View>
        <Pressable onPress={toggle} hitSlop={10} style={styles.themeToggle}>
          <Text style={styles.themeToggleIcon}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
        </Pressable>
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

function makeStyles(colors: ThemeColors, space: (n: number) => number, radius: number) {
  return StyleSheet.create({
    container: { flex: 1, padding: space(4) },
    topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: space(5) },
    topBarSpacer: { width: 40 },
    logoBox: { flex: 1, alignItems: 'center' },
    logo: { width: 92, height: 74 },
    logoSub: { fontSize: 15, color: colors.muted, marginTop: space(2) },
    themeToggle: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeToggleIcon: { fontSize: 20 },
    list: { marginTop: space(4) },
    categoryCard: {
      borderRadius: radius,
      padding: space(5),
      marginBottom: space(3),
    },
    categoryTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
    categorySub: { color: '#ffffffcc', fontSize: 14, marginTop: space(1) },
    resultRow: {
      backgroundColor: colors.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: space(4),
      marginBottom: space(2),
    },
    resultTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    resultMeta: { fontSize: 13, color: colors.muted, marginTop: space(1) },
    snippet: { fontSize: 13, color: colors.muted, marginTop: space(2), lineHeight: 18 },
    snippetMatch: { backgroundColor: '#fde68a', color: '#111827', fontWeight: '700' },
    empty: { textAlign: 'center', color: colors.muted, marginTop: space(6) },
  });
}
