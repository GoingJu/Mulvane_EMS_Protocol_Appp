import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { findProtocol, findCategory } from '../data/protocols';
import { PROTOCOL_PAGES } from '../data/pageMap';
import { PAGE_IMAGES } from '../assets/pages';
import PageViewer from '../components/PageViewer';
import { theme } from '../theme';

const RATIO = 1650 / 1275; // height / width of the rendered pages

type Props = {
  protocolId: string;
  onBack: () => void;
};

export default function ProtocolScreen({ protocolId, onBack }: Props) {
  const hit = findProtocol(protocolId);
  const category = hit ? findCategory(hit.categoryId) : undefined;
  const accent = category?.accent ?? theme.colors.primary;
  const pages = PROTOCOL_PAGES[protocolId] ?? [];

  const { width } = useWindowDimensions();
  const imgW = width - theme.space(8);
  const imgH = imgW * RATIO;

  const [viewerStart, setViewerStart] = useState<number | null>(null);

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
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Source: Mulvane EMS Protocols, effective May 1, 2022. Always verify
            against current protocols and medical direction. Tap a page to zoom.
          </Text>
        </View>

        {pages.length === 0 ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderTitle}>No page on file</Text>
            <Text style={styles.placeholderText}>
              This protocol isn’t mapped to a source page yet.
            </Text>
          </View>
        ) : (
          pages.map((p, i) => (
            <Pressable
              key={p}
              style={styles.pageCard}
              onPress={() => setViewerStart(i)}
            >
              <Image
                source={PAGE_IMAGES[p]}
                style={{ width: imgW, height: imgH }}
                resizeMode="contain"
              />
              <Text style={styles.pageLabel}>Page {p} · tap to zoom</Text>
            </Pressable>
          ))
        )}
      </ScrollView>

      {viewerStart !== null && (
        <PageViewer
          key={viewerStart}
          pages={pages}
          startIndex={viewerStart}
          onClose={() => setViewerStart(null)}
        />
      )}
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
  disclaimer: {
    backgroundColor: '#fef3c7',
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: '#fde68a',
    padding: theme.space(3),
    marginBottom: theme.space(4),
  },
  disclaimerText: { fontSize: 12.5, lineHeight: 18, color: '#92400e' },
  pageCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.space(2),
    marginBottom: theme.space(4),
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    paddingTop: theme.space(2),
  },
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
