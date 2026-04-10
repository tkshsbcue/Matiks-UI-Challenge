import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';
import { TIMING, DELAY } from '../constants/animations';

const { width: SW, height: SH } = Dimensions.get('window');
const COUNT = 35;
const GRAVITY = 700;
const DUR = TIMING.confetti.duration;
const PARTICLE_COLORS = [COLORS.green, COLORS.greenBright, COLORS.cyan, COLORS.orange, COLORS.purple, COLORS.yellow];

interface PConfig {
  x0: number; y0: number; vx: number; vy: number;
  size: number; color: string; rot: number; rotSpd: number; strip: boolean;
}

function makeParticles(): PConfig[] {
  const cx = SW / 2, cy = SH * 0.25;
  return Array.from({ length: COUNT }, () => {
    const a = Math.random() * Math.PI * 2;
    const spd = 200 + Math.random() * 350;
    const s = 4 + Math.random() * 5;
    return {
      x0: cx + (Math.random() - 0.5) * 20,
      y0: cy + (Math.random() - 0.5) * 10,
      vx: Math.cos(a) * spd,
      vy: -Math.abs(Math.sin(a) * spd) - 120,
      size: s,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      rot: Math.random() * 360,
      rotSpd: (Math.random() - 0.5) * 600,
      strip: s > 6.5,
    };
  });
}

function Particle({ c, delay }: { c: PConfig; delay: number }) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration: DUR, easing: Easing.linear }));
  }, []);

  const style = useAnimatedStyle(() => {
    const t = p.value * (DUR / 1000);
    const prog = p.value;
    const opacity = prog < 0.05 ? prog * 20 : prog > 0.5 ? Math.max(0, 1 - (prog - 0.5) / 0.5) : 1;
    return {
      transform: [
        { translateX: c.x0 + c.vx * t },
        { translateY: c.y0 + c.vy * t + 0.5 * GRAVITY * t * t },
        { rotate: `${c.rot + c.rotSpd * t}deg` },
      ],
      opacity,
    };
  });

  const w = c.strip ? c.size * 0.4 : c.size;
  const h = c.strip ? c.size * 1.4 : c.size;

  return (
    <Animated.View style={[
      styles.p,
      { width: w, height: h, borderRadius: c.strip ? 1 : c.size / 2, backgroundColor: c.color },
      style,
    ]} />
  );
}

export default function ConfettiCanvas() {
  const reduced = useReducedMotion();
  const particles = useMemo(() => makeParticles(), []);
  if (reduced) return null;

  return (
    <View style={styles.c} pointerEvents="none">
      {particles.map((c, i) => (
        <Particle key={i} c={c} delay={DELAY.confetti + Math.random() * 100} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  c: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  p: { position: 'absolute', top: 0, left: 0 },
});
