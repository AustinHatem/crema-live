import React, { useRef } from "react";
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
import StartStreamBottomSheet, { StartStreamBottomSheetRef } from "../components/StartStreamBottomSheet";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const startStreamSheetRef = useRef<StartStreamBottomSheetRef>(null);

  const handleCreateStream = (e: any) => {
    e.preventDefault();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startStreamSheetRef.current?.present();
  };

  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#1a1a1a",
          paddingBottom: 10,
          paddingTop: 6,
          height: 95,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#FFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.medium,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 0,
          paddingBottom: 4,
          paddingHorizontal: 4,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
              <Image source={require("../assets/icons/Home.png")} style={{ width: 20, height: 20, tintColor: color }} resizeMode="contain" />
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
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
              <Image source={require("../assets/icons/Search.png")} style={{ width: 20, height: 20, tintColor: color }} resizeMode="contain" />
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
        name="Live"
        component={LiveScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? colors.primary : "#2A292E",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 15,
                marginBottom: 0,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: focused ? 0.25 : 0,
                shadowRadius: 3.84,
                elevation: focused ? 5 : 0,
              }}
            >
              <Image source={require("../assets/icons/Plus.png")} style={{ width: 20, height: 20, tintColor: "#FFF" }} resizeMode="contain" />
            </View>
          ),
        }}
        listeners={{
          tabPress: handleCreateStream,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
              <Image source={require("../assets/icons/Inbox.png")} style={{ width: 20, height: 20, tintColor: color }} resizeMode="contain" />
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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
              <Image source={require("../assets/icons/User.png")} style={{ width: 20, height: 20, tintColor: color }} resizeMode="contain" />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        }}
      />
    </Tab.Navigator>
    <StartStreamBottomSheet ref={startStreamSheetRef} />
    </View>
  );
};

export default MainNavigator;
