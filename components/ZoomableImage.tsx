import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  source: any;
  // Fit-to-screen size of the page (whole page visible at scale 1).
  width: number;
  height: number;
};

const MAX_SCALE = 6;

// Pinch-to-zoom + drag-to-pan + double-tap-to-toggle image. The page is shown
// whole at scale 1; users pinch to read fine print. Built on gesture-handler +
// reanimated so it works natively in Expo Go on Android and iOS.
export default function ZoomableImage({ source, width, height }: Props) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(
        MAX_SCALE,
        Math.max(1, savedScale.value * e.scale),
      );
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        tx.value = withTiming(0);
        ty.value = withTiming(0);
        savedTx.value = 0;
        savedTy.value = 0;
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        tx.value = withTiming(0);
        ty.value = withTiming(0);
        savedTx.value = 0;
        savedTy.value = 0;
      } else {
        scale.value = withTiming(3);
        savedScale.value = 3;
      }
    });

  // Race (not Exclusive) so pinch/pan can activate immediately instead of
  // waiting ~500ms for the double-tap gesture to fail first.
  const gesture = Gesture.Race(Gesture.Simultaneous(pinch, pan), doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={{ width, height }} collapsable={false}>
        <Animated.Image
          source={source}
          resizeMode="contain"
          style={[{ width, height }, animatedStyle]}
        />
      </Animated.View>
    </GestureDetector>
  );
}
