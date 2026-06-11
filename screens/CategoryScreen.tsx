import { useMemo, useState } from 'react';
import { View, Text, Pressable, SectionList, StyleSheet } from 'react-native';
import { findCategory } from '../data/protocols';
import SearchBar from '../components/SearchBar';
import { theme } from '../theme';

type Props = {
  categoryId: string;
  onBack: () => void;
  onOpenProtocol: (protocolId: string) => void;
};

export default function CategoryScreen({
  categoryId,
  onBack,
  onOpenProtocol,
}: Props) {
  const category = findCategory(categoryId);
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    if (!category) return [];
    const q = query.trim().toLowerCase();
    return category.sections
      .map((s) => ({
        title: s.title ?? '',
        data: s.protocols.filter((pr) =>
          pr.title.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.data.length > 0);
  }, [category, query]);

  if (!category) {
    return (
      <View style={styles.container}>
        <Text>Unknown category.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: category.accent }]}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>‹ Home</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{category.title}</Text>
        {category.subtitle ? (
          <Text style={styles.headerSub}>{category.subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.body}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={`Search ${category.title}…`}
        />
        <SectionList
          style={styles.list}
          sections={sections}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {category.sections.every((s) => s.protocols.length === 0)
                ? 'Protocols coming soon.'
                : `No protocols match “${query}”.`}
            </Text>
          }
          renderSectionHeader={({ section }) =>
            section.title ? (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => onOpenProtocol(item.id)}
            >
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingTop: theme.space(12), padding: theme.space(4) },
  back: { color: '#ffffffdd', fontSize: 16, marginBottom: theme.space(2) },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: '#ffffffcc', fontSize: 14, marginTop: theme.space(1) },
  body: { flex: 1, padding: theme.space(4) },
  list: { marginTop: theme.space(3) },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: theme.colors.muted,
    marginTop: theme.space(4),
    marginBottom: theme.space(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.space(4),
    marginBottom: theme.space(2),
  },
  rowTitle: { fontSize: 17, color: theme.colors.text, flex: 1 },
  chevron: { fontSize: 22, color: theme.colors.muted, marginLeft: theme.space(2) },
  empty: { textAlign: 'center', color: theme.colors.muted, marginTop: theme.space(8) },
});
