import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { fonts } from '../utils/globalStyles';

interface TabHeaderProps {
  activeTab: 'Following' | 'Live';
  onTabPress: (tab: 'Following' | 'Live') => void;
  scrollProgress: Animated.Value;
}

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabPress, scrollProgress }) => {
  // Text width estimations (approximate) - adjusted for larger font size
  const followingTextWidth = 78; // "Following" is longer (increased for 18px font)
  const liveTextWidth = 32; // "Live" is shorter (increased for 18px font)

  // Calculate underline position to align with text start
  // Following tab start: 20 (container padding) + 4 (tab padding) = 24
  // Live tab start: 24 + 78 (following text) + 4 (tab padding) + 12 (gap) + 4 (tab padding) = 122
  const underlineTranslateX = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 122], // Align with text start positions (updated for larger font)
    extrapolate: 'clamp',
  });

  // Animate underline width based on text length
  const underlineWidth = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [followingTextWidth, liveTextWidth], // Width matches text length
    extrapolate: 'clamp',
  });

  // Animate text opacity based on scroll progress
  const followingOpacity = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4], // Full opacity when active, faded when inactive
    extrapolate: 'clamp',
  });

  const liveOpacity = scrollProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1], // Faded when inactive, full opacity when active
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress('Following')}
      >
        <Animated.Text
          style={[
            styles.tabText,
            { opacity: followingOpacity },
            activeTab === 'Following' && styles.activeTabText
          ]}
        >
          Following
        </Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress('Live')}
      >
        <Animated.Text
          style={[
            styles.tabText,
            { opacity: liveOpacity },
            activeTab === 'Live' && styles.activeTabText
          ]}
        >
          Live
        </Animated.Text>
      </TouchableOpacity>

      {/* Animated underline */}
      <Animated.View
        style={[
          styles.underline,
          {
            transform: [{ translateX: underlineTranslateX }],
            width: underlineWidth,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'flex-start',
    gap: 12, // Further reduced from 20 to 12
    position: 'relative',
  },
  tab: {
    paddingHorizontal: 4, // Further reduced padding for even tighter layout
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabText: {
    color: '#FFF', // Full white, opacity handled by animated values
    fontSize: 18, // Increased from 16 to 18
    fontFamily: fonts.medium,
  },
  activeTabText: {
    color: '#FFF',
    fontFamily: fonts.bold,
  },
  underline: {
    position: 'absolute',
    bottom: 8, // Moved up from 4 to 8
    height: 3, // Increased from 2 to 3 for thicker line
    // width is now animated and set via props
    backgroundColor: '#FFF',
    borderRadius: 1.5, // Adjusted radius for thicker line
  },
});

export default TabHeader;