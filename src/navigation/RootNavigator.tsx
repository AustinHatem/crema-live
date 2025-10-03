import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types';
import { useAuth } from '../store/AuthContext';

import MainNavigator from './MainNavigator';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import StreamViewScreen from '../screens/StreamViewScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f73558" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // User is signed in
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen
              name="StreamView"
              component={StreamViewScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfileScreen}
              options={{
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen name="Auth" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default RootNavigator;