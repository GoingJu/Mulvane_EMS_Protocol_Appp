import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { findProtocol, findCategory } from '../data/protocols';
import { theme } from '../theme';

type Props = {
  protocolId: string;
  onBack: () => void;
};

export default function ProtocolScreen({ protocolId, onBack }: Props) {
  const hit = findProtocol(protocolId);
  const category = hit ? findCategory(hit.categoryId) : undefined;
  const accent = category?.accent ?? theme.colors.primary;

  if (!hit) {
    return (
      <View style={styles.container}>
        <Text>Unknown protocol.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: accent }]}>
        <Pressable onPress={onBack} hitSlop={10}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>
        <Text style={styles.crumb}>
          {hit.categoryTitle}
          {hit.sectionTitle ? ` · ${hit.sectionTitle}` : ''}
        </Text>
        <Text style={styles.title}>{hit.protocol.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {hit.protocol.body ? (
          <Text style={styles.bodyText}>{hit.protocol.body}</Text>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>Content coming soon</Text>
            <Text style={styles.placeholderText}>
              This protocol’s steps, dosing, and diagrams will be added here from
              the official Mulvane EMS Protocols document.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingTop: theme.space(12), padding: theme.space(4) },
  back: { color: '#ffffffdd', fontSize: 16, marginBottom: theme.space(2) },
  crumb: { color: '#ffffffcc', fontSize: 13 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: theme.space(1) },
  body: { padding: theme.space(4) },
  bodyText: { fontSize: 17, lineHeight: 26, color: theme.colors.text },
  placeholder: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.space(5),
  },
  placeholderTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  placeholderText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.muted,
    marginTop: theme.space(2),
  },
});
