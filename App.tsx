import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { AuthProvider } from './src/store/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'ABCDiatype': require('./src/assets/fonts/ABCDiatype-Regular-Trial.otf'),
    'ABCDiatype-Bold': require('./src/assets/fonts/ABCDiatype-Bold.otf'),
    'ABCDiatype-Medium': require('./src/assets/fonts/ABCDiatype-Medium.otf'),
    'ABCDiatype-Light': require('./src/assets/fonts/ABCDiatype-Light-Trial.otf'),
    'ABCDiatype-Thin': require('./src/assets/fonts/ABCDiatype-Thin-Trial.otf'),
    'ABCDiatype-Heavy': require('./src/assets/fonts/ABCDiatype-Heavy-Trial.otf'),
    'ABCDiatype-Black': require('./src/assets/fonts/ABCDiatype-Black-Trial.otf'),
    'ABCDiatype-Ultra': require('./src/assets/fonts/ABCDiatype-Ultra-Trial.otf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
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