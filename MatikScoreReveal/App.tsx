import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScoreRevealScreen from './src/screens/ScoreRevealScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" translucent />
      <ScoreRevealScreen />
    </SafeAreaProvider>
  );
}
