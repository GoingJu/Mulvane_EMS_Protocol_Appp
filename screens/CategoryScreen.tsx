import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, SectionList, StyleSheet, BackHandler } from 'react-native';
import { findCategory } from '../data/protocols';
import SearchBar from '../components/SearchBar';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';

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
  const { colors, space, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, space, radius), [colors, space, radius]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

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

function makeStyles(colors: ThemeColors, space: (n: number) => number, radius: number) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { paddingTop: space(12), padding: space(4) },
    back: { color: '#ffffffdd', fontSize: 16, marginBottom: space(2) },
    headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
    headerSub: { color: '#ffffffcc', fontSize: 14, marginTop: space(1) },
    body: { flex: 1, padding: space(4) },
    list: { marginTop: space(3) },
    sectionHeader: {
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: colors.muted,
      marginTop: space(4),
      marginBottom: space(2),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: space(4),
      marginBottom: space(2),
    },
    rowTitle: { fontSize: 17, color: colors.text, flex: 1 },
    chevron: { fontSize: 22, color: colors.muted, marginLeft: space(2) },
    empty: { textAlign: 'center', color: colors.muted, marginTop: space(8) },
  });
}
