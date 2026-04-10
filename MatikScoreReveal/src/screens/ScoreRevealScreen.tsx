import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { TIMING, DELAY, GAME_DATA } from '../constants/animations';

import ScoreCounter from '../components/ScoreCounter';
import ComboStreakBadge from '../components/ComboStreakBadge';
import RankReveal from '../components/RankReveal';
import GameStats from '../components/GameStats';
import ShareButton from '../components/ShareButton';
import ConfettiCanvas from '../components/ConfettiCanvas';

export default function ScoreRevealScreen() {
  const reduced = useReducedMotion();
  const screenOpacity = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = reduced
      ? 1
      : withTiming(1, TIMING.fadeIn);

    if (!reduced && Platform.OS === 'ios') {
      const t1 = setTimeout(
        () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
        DELAY.combo
      );
      const t2 = setTimeout(
        () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
        DELAY.scoreEnd
      );
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [reduced]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <View style={styles.root}>
      <ConfettiCanvas />

      <Animated.View style={[styles.fill, fadeStyle]}>
        <SafeAreaView style={styles.fill}>
          <View style={styles.layout}>

            {/* Score area */}
            <View style={styles.scoreSection}>
              <ScoreCounter targetScore={GAME_DATA.playerScore} />

              <View style={styles.comboWrap}>
                <ComboStreakBadge streak={GAME_DATA.comboStreak} />
              </View>

              <View style={styles.rankWrap}>
                <RankReveal rank={GAME_DATA.rank} totalPlayers={GAME_DATA.totalPlayers} />
              </View>
            </View>

            {/* Bottom area */}
            <View style={styles.bottomSection}>
              <View style={styles.statsWrap}>
                <GameStats
                  accuracy={GAME_DATA.accuracy}
                  avgTime={GAME_DATA.avgTime}
                  xpEarned={GAME_DATA.xpEarned}
                />
              </View>

              <ShareButton />

              <Text style={styles.brand}>MATIKS</Text>
            </View>

          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  fill: { flex: 1 },
  layout: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  scoreSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comboWrap: {
    marginTop: SPACING.lg,
  },
  rankWrap: {
    marginTop: SPACING.xl,
  },
  bottomSection: {
    gap: SPACING.md,
    alignItems: 'center',
    paddingBottom: SPACING.xs,
  },
  statsWrap: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  brand: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDim,
    letterSpacing: 4,
    includeFontPadding: false,
  },
});
