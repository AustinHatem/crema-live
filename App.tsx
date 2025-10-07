import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/store/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roobert': require('./src/assets/fonts/Roobert-Regular.ttf'),
    'Roobert-Bold': require('./src/assets/fonts/Roobert-Bold.ttf'),
    'Roobert-SemiBold': require('./src/assets/fonts/Roobert-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
  },
});