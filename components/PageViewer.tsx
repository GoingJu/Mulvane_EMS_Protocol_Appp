import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ZoomableImage from './ZoomableImage';
import { PAGE_IMAGES } from '../assets/pages';
import { theme } from '../theme';

// Natural size of the rendered pages.
const PAGE_W = 1275;
const PAGE_H = 1650;

type Props = {
  pages: number[];
  startIndex: number;
  onClose: () => void;
};

export default function PageViewer({ pages, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const page = pages[index];

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setArea({ w: width, h: height });
  };

  // Fit the whole page inside the available stage (contain).
  let fitW = area.w;
  let fitH = area.w * (PAGE_H / PAGE_W);
  if (fitH > area.h) {
    fitH = area.h;
    fitW = area.h * (PAGE_W / PAGE_H);
  }

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      {/* gesture-handler needs its own root inside a RN Modal */}
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.bar}>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={styles.barBtn}>✕ Close</Text>
          </Pressable>
          <Text style={styles.barTitle}>
            Page {page}
            {pages.length > 1 ? `  ·  ${index + 1}/${pages.length}` : ''}
          </Text>
          <View style={{ width: 56 }} />
        </View>

        <View style={styles.stage} onLayout={onLayout}>
          {area.w > 0 && (
            <ZoomableImage
              key={`${page}-${Math.round(area.w)}`}
              source={PAGE_IMAGES[page]}
              width={fitW}
              height={fitH}
            />
          )}
        </View>

        <View style={styles.footer}>
          {pages.length > 1 && (
            <Pressable
              style={[styles.navBtn, index === 0 && styles.off]}
              disabled={index === 0}
              onPress={() => setIndex((i) => Math.max(0, i - 1))}
            >
              <Text style={styles.navTxt}>‹ Prev</Text>
            </Pressable>
          )}
          <Text style={styles.hint}>Pinch to zoom · double-tap to reset</Text>
          {pages.length > 1 && (
            <Pressable
              style={[styles.navBtn, index === pages.length - 1 && styles.off]}
              disabled={index === pages.length - 1}
              onPress={() =>
                setIndex((i) => Math.min(pages.length - 1, i + 1))
              }
            >
              <Text style={styles.navTxt}>Next ›</Text>
            </Pressable>
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.space(12),
    paddingHorizontal: theme.space(4),
    paddingBottom: theme.space(3),
    backgroundColor: '#000',
  },
  barBtn: { color: '#fff', fontSize: 16, fontWeight: '600' },
  barTitle: { color: '#fff', fontSize: 15 },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.space(3),
    backgroundColor: '#000',
  },
  navBtn: {
    backgroundColor: '#374151',
    paddingVertical: theme.space(2),
    paddingHorizontal: theme.space(4),
    borderRadius: 10,
  },
  navTxt: { color: '#fff', fontSize: 15, fontWeight: '600' },
  off: { opacity: 0.4 },
  hint: { color: '#9ca3af', fontSize: 12, flex: 1, textAlign: 'center' },
});
