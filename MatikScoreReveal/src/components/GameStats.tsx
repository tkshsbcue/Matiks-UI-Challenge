import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';
import { TIMING, DELAY } from '../constants/animations';

interface StatProps {
  label: string;
  value: string;
  color: string;
  index: number;
}

function Stat({ label, value, color, index }: StatProps) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = DELAY.stats + index * 100;
    if (reduced) { opacity.value = 1; translateY.value = 0; return; }

    opacity.value = withDelay(delay, withTiming(1, TIMING.fadeIn));
    translateY.value = withDelay(delay, withTiming(0, TIMING.slideUp));
  }, [reduced]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.stat, style]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function GameStats({ accuracy, avgTime, xpEarned }: {
  accuracy: number; avgTime: number; xpEarned: number;
}) {
  return (
    <View style={styles.row}>
      <Stat label="Accuracy" value={`${accuracy}%`} color={COLORS.green} index={0} />
      <View style={styles.divider} />
      <Stat label="Avg Time" value={`${avgTime}s`} color={COLORS.textPrimary} index={1} />
      <View style={styles.divider} />
      <Stat label="XP" value={`+${xpEarned}`} color={COLORS.orange} index={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
});
