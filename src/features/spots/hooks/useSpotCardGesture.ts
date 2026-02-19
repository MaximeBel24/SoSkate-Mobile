import { useState, useCallback } from "react";
import { ViewStyle } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  AnimatedStyle,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SWIPE_THRESHOLD = 50;

interface UseSpotCardGestureParams {
  compactHeight: number;
  expandedHeight: number;
}

interface UseSpotCardGestureReturn {
  isExpanded: boolean;
  toggleExpanded: () => void;
  panGesture: ReturnType<typeof Gesture.Pan>;
  animatedCardStyle: AnimatedStyle<ViewStyle>;
}

export function useSpotCardGesture({
  compactHeight,
  expandedHeight,
}: UseSpotCardGestureParams): UseSpotCardGestureReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardHeight = useSharedValue(compactHeight);
  const translateY = useSharedValue(0);

  const toggleExpanded = useCallback(() => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    cardHeight.value = withSpring(
      newExpandedState ? expandedHeight : compactHeight,
    );
  }, [isExpanded, compactHeight, expandedHeight, cardHeight]);

  const panGesture = Gesture.Pan()
    .enabled(isExpanded)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > SWIPE_THRESHOLD) {
        runOnJS(toggleExpanded)();
        translateY.value = withSpring(0);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    transform: [{ translateY: translateY.value }],
  }));

  return {
    isExpanded,
    toggleExpanded,
    panGesture,
    animatedCardStyle,
  };
}
