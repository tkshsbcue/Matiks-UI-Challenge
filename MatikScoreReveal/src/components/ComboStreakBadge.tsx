import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';
import { SPRINGS, TIMING, DELAY } from '../constants/animations';

export default function ComboStreakBadge({ streak }: { streak: number }) {
  const reduced = useReducedMotion();
  const badgeScale = useSharedValue(0);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    if (reduced) { badgeScale.value = 1; return; }

    badgeScale.value = withDelay(DELAY.combo, withSpring(1, SPRINGS.bouncy));

    flameScale.value = withDelay(
      DELAY.combo + 500,
      withRepeat(
        withSequence(
          withTiming(1.2, TIMING.flamePulse),
          withTiming(1.0, TIMING.flamePulse)
        ),
        -1, true
      )
    );
  }, [reduced, streak]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value > 0.01 ? 1 : 0,
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <Animated.View style={[styles.badge, badgeStyle]}>
      <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
      <View style={styles.textRow}>
        <Text style={styles.streakNum}>{streak}</Text>
        <Text style={styles.streakLabel}> Combo Streak</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  flame: {
    fontSize: 22,
    includeFontPadding: false,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNum: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.orange,
    includeFontPadding: false,
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    includeFontPadding: false,
  },
});
