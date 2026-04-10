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

export default function RankReveal({ rank, totalPlayers }: { rank: number; totalPlayers: number }) {
  const reduced = useReducedMotion();
  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (reduced) { translateY.value = 0; opacity.value = 1; return; }

    translateY.value = withDelay(DELAY.rank, withTiming(0, TIMING.slideUp));
    opacity.value = withDelay(DELAY.rank, withTiming(1, TIMING.fadeIn));
  }, [reduced]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.wrap, style]}>
      <View style={styles.row}>
        <Text style={styles.hash}>#</Text>
        <Text style={styles.rank}>{rank}</Text>
        <Text style={styles.of}>  of {totalPlayers.toLocaleString()}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hash: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cyan,
    includeFontPadding: false,
  },
  rank: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.cyan,
    includeFontPadding: false,
  },
  of: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMuted,
    includeFontPadding: false,
  },
});
