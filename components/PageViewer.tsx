import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { PAGE_IMAGES } from '../assets/pages';
import { theme } from '../theme';

// Rendered page aspect ratio (height / width) from the 1275x1650 source images.
const RATIO = 1650 / 1275;

type Props = {
  pages: number[];
  startIndex: number;
  onClose: () => void;
};

// Full-screen page viewer with zoom (buttons work on every platform; iOS also
// supports pinch via the ScrollView). Dependency-free so it runs in Expo Go.
export default function PageViewer({ pages, startIndex, onClose }: Props) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);

  const page = pages[index];
  const imgW = width * scale;
  const imgH = imgW * RATIO;

  const zoom = (delta: number) =>
    setScale((s) => Math.min(4, Math.max(1, +(s + delta).toFixed(2))));

  const go = (dir: number) => {
    setIndex((i) => Math.min(pages.length - 1, Math.max(0, i + dir)));
    setScale(1);
  };

  return (
    <Modal visible animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
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

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.center}
          maximumZoomScale={4}
          minimumZoomScale={1}
        >
          <ScrollView horizontal contentContainerStyle={styles.center}>
            <Image
              source={PAGE_IMAGES[page]}
              style={{ width: imgW, height: imgH }}
              resizeMode="contain"
            />
          </ScrollView>
        </ScrollView>

        <View style={styles.controls}>
          <Pressable style={styles.ctrl} onPress={() => zoom(-0.5)}>
            <Text style={styles.ctrlTxt}>－</Text>
          </Pressable>
          <Pressable style={styles.ctrl} onPress={() => setScale(1)}>
            <Text style={styles.ctrlTxt}>Reset</Text>
          </Pressable>
          <Pressable style={styles.ctrl} onPress={() => zoom(0.5)}>
            <Text style={styles.ctrlTxt}>＋</Text>
          </Pressable>
          {pages.length > 1 && (
            <>
              <Pressable
                style={[styles.ctrl, index === 0 && styles.ctrlOff]}
                disabled={index === 0}
                onPress={() => go(-1)}
              >
                <Text style={styles.ctrlTxt}>‹ Prev</Text>
              </Pressable>
              <Pressable
                style={[styles.ctrl, index === pages.length - 1 && styles.ctrlOff]}
                disabled={index === pages.length - 1}
                onPress={() => go(1)}
              >
                <Text style={styles.ctrlTxt}>Next ›</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111827' },
  flex: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center', flexGrow: 1 },
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: theme.space(2),
    padding: theme.space(3),
    backgroundColor: '#000',
  },
  ctrl: {
    backgroundColor: '#374151',
    paddingVertical: theme.space(2),
    paddingHorizontal: theme.space(4),
    borderRadius: 10,
    minWidth: 52,
    alignItems: 'center',
  },
  ctrlOff: { opacity: 0.4 },
  ctrlTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
