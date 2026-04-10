import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, Pressable, View, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';
import { SPRINGS, TIMING, DELAY } from '../constants/animations';

const SHIMMER_W = 70;

export default function ShareButton() {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0);
  const press = useSharedValue(1);
  const shimmerX = useSharedValue(-SHIMMER_W * 2);

  useEffect(() => {
    if (reduced) { opacity.value = 1; return; }

    opacity.value = withDelay(DELAY.button, withTiming(1, TIMING.fadeIn));

    shimmerX.value = withDelay(
      DELAY.button + 600,
      withRepeat(
        withSequence(
          withTiming(320, TIMING.shimmer),
          withDelay(TIMING.shimmerPause, withTiming(-SHIMMER_W * 2, { duration: 0 }))
        ),
        -1, false
      )
    );
  }, [reduced]);

  const onIn = useCallback(() => {
    press.value = withSpring(0.97, SPRINGS.snappy);
    if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const onOut = useCallback(() => {
    press.value = withSpring(1, SPRINGS.snappy);
  }, []);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: press.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <Animated.View style={[styles.wrap, wrapStyle]}>
      <Pressable onPressIn={onIn} onPressOut={onOut} style={styles.pressable}>
        <View style={styles.button}>
          <Text style={styles.text}>Share Result</Text>

          <View style={styles.shimmerClip}>
            <Animated.View style={[styles.shimmer, shimmerStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.12)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingHorizontal: 24 },
  pressable: { borderRadius: 12, overflow: 'hidden' },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.8,
    includeFontPadding: false,
  },
  shimmerClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 12,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_W,
  },
});
