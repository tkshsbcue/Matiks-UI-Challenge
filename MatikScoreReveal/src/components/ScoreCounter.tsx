import React, { useEffect } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withDelay,
  withSequence,
  withTiming,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';
import { SPRINGS, TIMING, DELAY } from '../constants/animations';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function formatNumber(n: number): string {
  'worklet';
  const val = Math.round(Math.max(0, n));
  const str = val.toString();
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (i > 0 && (str.length - i) % 3 === 0) result += ',';
    result += str[i];
  }
  return result;
}

export default function ScoreCounter({ targetScore }: { targetScore: number }) {
  const reduced = useReducedMotion();
  const value = useSharedValue(0);
  const scale = useSharedValue(1);
  const labelOpacity = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      value.value = targetScore;
      labelOpacity.value = 1;
      return;
    }

    labelOpacity.value = withDelay(DELAY.label, withTiming(1, TIMING.fadeIn));

    value.value = withDelay(
      DELAY.score,
      withSequence(
        withTiming(targetScore * 1.02, TIMING.scoreCount),
        withSpring(targetScore, SPRINGS.settle)
      )
    );

    scale.value = withDelay(
      DELAY.scoreEnd,
      withSequence(
        withSpring(1.04, { damping: 8, stiffness: 200, mass: 0.5 }),
        withSpring(1, SPRINGS.settle)
      )
    );
  }, [reduced, targetScore]);

  const animatedProps = useAnimatedProps(() => ({
    text: formatNumber(value.value),
    defaultValue: formatNumber(value.value),
  }) as Record<string, string>);

  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));
  const scoreStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.wrap}>
      <Animated.Text style={[styles.label, labelStyle]}>
        YOUR SCORE
      </Animated.Text>
      <Animated.View style={scoreStyle}>
        <AnimatedTextInput
          underlineColorAndroid="transparent"
          editable={false}
          animatedProps={animatedProps}
          style={styles.number}
          caretHidden
          contextMenuHidden
          accessibilityLabel={`Score: ${targetScore}`}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 5,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
    includeFontPadding: false,
  },
  number: {
    fontSize: 84,
    fontWeight: '900',
    color: COLORS.greenBright,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    fontVariant: ['tabular-nums'],
    minWidth: 260,
    includeFontPadding: false,
    // Android: TextInput adds vertical padding by default — kill it
    ...(Platform.OS === 'android' && {
      textAlignVertical: 'center' as const,
      paddingVertical: 0,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  },
});
