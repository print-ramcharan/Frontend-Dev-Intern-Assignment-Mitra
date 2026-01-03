import React from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import tokenCache from './src/utils/tokenCache';
import AppNavigator from './src/navigation/AppNavigator';

// TODO: Replace with your actual Clerk Publishable Key
// You can find this in your Clerk Dashboard -> API Keys
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
