import { Easing } from 'react-native-reanimated';

export const SPRINGS = {
  bouncy: { damping: 12, stiffness: 170, mass: 0.8 },
  settle: { damping: 18, stiffness: 120, mass: 1 },
  snappy: { damping: 14, stiffness: 220, mass: 0.5 },
};

export const TIMING = {
  scoreCount: { duration: 2000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  fadeIn:     { duration: 350, easing: Easing.out(Easing.cubic) },
  slideUp:    { duration: 400, easing: Easing.out(Easing.cubic) },
  shimmer:    { duration: 1500, easing: Easing.inOut(Easing.ease) },
  shimmerPause: 2500,
  flamePulse: { duration: 900, easing: Easing.inOut(Easing.ease) },
  confetti:   { duration: 2200, easing: Easing.out(Easing.quad) },
};

// All delays from screen mount (ms)
export const DELAY = {
  label:    150,
  score:    350,
  combo:    1100,
  scoreEnd: 2350,    // score delay + count duration
  confetti: 2350,
  rank:     2600,
  stats:    2850,
  button:   3200,
};

export const GAME_DATA = {
  playerScore: 2840,
  comboStreak: 7,
  rank: 3,
  totalPlayers: 1200,
  accuracy: 94,
  avgTime: 1.8,
  xpEarned: 320,
};
