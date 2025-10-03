import React from "react";
import { View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { MainTabParamList } from "../types";
import { fonts, colors } from "../utils/globalStyles";

import FeedScreen from "../screens/FeedScreen";
import SearchScreen from "../screens/SearchScreen";
import LiveScreen from "../screens/LiveScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#1a1a1a",
          paddingBottom: 5,
          paddingTop: 2,
          height: 85,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarLabelStyle: {
          display: 'none',
        },
        tabBarItemStyle: {
          paddingTop: 5,
          paddingBottom: 10,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/Home2-Bold-80px.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/SearchNormal1-Outline-80px.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
      <Tab.Screen
        name="Live"
        component={LiveScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? colors.primary : "#333",
                justifyContent: "center",
                alignItems: "center",
                marginTop: -5,
                marginBottom: 5,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: focused ? 0.25 : 0,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <Image
                source={require('../assets/icons/Add-Outline-80px.png')}
                style={{ width: 28, height: 28, tintColor: '#FFF' }}
              />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/Notification-Bold-80px.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/icons/Profile-Bold-80px.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
