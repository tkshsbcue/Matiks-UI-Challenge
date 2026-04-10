# Matiks — Animated Score Reveal & Combo Streak UI

Post-game score reveal screen for [Matiks](https://www.matiks.in/) — a competitive mental math dueling platform.

## iOS

https://github.com/user-attachments/assets/eddc7aa8-16c9-4d5c-8991-870064a3991f

## Android

https://github.com/user-attachments/assets/bce9a0e1-4c90-49be-8a43-58cba05130a6

## Tech Stack

- **React Native** (Expo SDK 52)
- **Reanimated 3** — all animations on UI thread
- **expo-haptics** — tactile feedback on iOS
- **expo-linear-gradient** — shimmer effect

## Animations

| Element | Animation | Reanimated APIs |
|---|---|---|
| Score Counter | Tick-up 0→2,840 with overshoot + spring settle | `withTiming`, `withSequence`, `withSpring` |
| Combo Badge | Bounce-in with spring overshoot, looping flame pulse | `withSpring`, `withRepeat` |
| Rank Reveal | Slide-up + fade, staggered 200ms after score | `withDelay`, `withTiming` |
| Share Button | Shimmer glint loop, spring press feedback | `withRepeat`, `withSequence`, `withSpring` |
| Confetti | 35 particles with physics (gravity, rotation, fade) | `withTiming`, `useAnimatedStyle` |
| Game Stats | Staggered fade-in + slide-up (100ms apart) | `withDelay`, `withTiming` |

## Constraints Met

- Reanimated 3 APIs only (`useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withSequence`, `withRepeat`)
- No `setState` inside animation callbacks — all UI thread
- No third-party animation libraries
- `useReducedMotion` accessibility support
- iOS + Android parity

## Run

```bash
cd MatikScoreReveal
npm install
npx expo start --clear
```

## Project Structure

```
src/
├── constants/
│   ├── theme.ts          # Matiks brand colors & spacing
│   └── animations.ts     # Spring configs, timing, delays
├── components/
│   ├── ScoreCounter.tsx   # Animated score tick-up
│   ├── ComboStreakBadge.tsx
│   ├── RankReveal.tsx
│   ├── ShareButton.tsx    # Shimmer + press feedback
│   ├── GameStats.tsx      # Accuracy, time, XP
│   └── ConfettiCanvas.tsx # Particle burst
└── screens/
    └── ScoreRevealScreen.tsx
```
