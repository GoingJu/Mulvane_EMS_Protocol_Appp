import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import { findProtocol, findCategory } from '../data/protocols';
import { PROTOCOL_PAGES } from '../data/pageMap';
import { PAGE_IMAGES } from '../assets/pages';
import PageViewer from '../components/PageViewer';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../theme';

const RATIO = 1650 / 1275; // height / width of the rendered pages

type Props = {
  protocolId: string;
  onBack: () => void;
};

export default function ProtocolScreen({ protocolId, onBack }: Props) {
  const { colors, space, radius } = useTheme();
  const styles = useMemo(() => makeStyles(colors, space, radius), [colors, space, radius]);

  const hit = findProtocol(protocolId);
  const category = hit ? findCategory(hit.categoryId) : undefined;
  const accent = category?.accent ?? colors.primary;
  const pages = PROTOCOL_PAGES[protocolId] ?? [];

  const { width } = useWindowDimensions();
  const imgW = width - space(8);
  const imgH = imgW * RATIO;

  const [viewerStart, setViewerStart] = useState<number | null>(null);

  // The page viewer's own Modal already handles Android back to close itself
  // (onRequestClose); this only fires when the viewer isn't open.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);

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

function makeStyles(colors: ThemeColors, space: (n: number) => number, radius: number) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    header: { paddingTop: space(12), padding: space(4) },
    back: { color: '#ffffffdd', fontSize: 16, marginBottom: space(2) },
    crumb: { color: '#ffffffcc', fontSize: 13 },
    title: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: space(1) },
    body: { padding: space(4) },
    disclaimer: {
      backgroundColor: '#fef3c7',
      borderRadius: radius,
      borderWidth: 1,
      borderColor: '#fde68a',
      padding: space(3),
      marginBottom: space(4),
    },
    disclaimerText: { fontSize: 12.5, lineHeight: 18, color: '#92400e' },
    pageCard: {
      backgroundColor: colors.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: space(2),
      marginBottom: space(4),
      alignItems: 'center',
    },
    pageLabel: {
      fontSize: 12,
      color: colors.muted,
      paddingTop: space(2),
    },
    placeholder: {
      backgroundColor: colors.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: colors.border,
      padding: space(5),
    },
    placeholderTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
    placeholderText: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.muted,
      marginTop: space(2),
    },
  });
}
