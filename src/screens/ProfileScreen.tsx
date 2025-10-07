import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../store/AuthContext';
import { fonts, colors } from '../utils/globalStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'Home' | 'About' | 'Clips' | 'Videos' | 'Schedule';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!user) {
    return null; // This shouldn't happen as the user should be authenticated
  }

  // Create scroll progress for tab underline
  const scrollProgress = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH, SCREEN_WIDTH * 2, SCREEN_WIDTH * 3, SCREEN_WIDTH * 4],
    outputRange: [0, 0.25, 0.5, 0.75, 1],
    extrapolate: 'clamp',
  });

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    const tabs: TabType[] = ['Home', 'About', 'Clips', 'Videos', 'Schedule'];
    const pageIndex = tabs.indexOf(tab);
    scrollRef.current?.scrollTo({ x: pageIndex * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (event: any) => {
    const scrollXValue = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollXValue / SCREEN_WIDTH);
    const tabs: TabType[] = ['Home', 'About', 'Clips', 'Videos', 'Schedule'];
    const newTab = tabs[pageIndex];
    if (newTab && newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const renderEmptyState = (title: string, subtitle: string) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="film-outline" size={60} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Purple Header */}
      <View style={styles.gradientHeader}>
        {/* Header Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Image
              source={require('../assets/icons/Settings.png')}
              style={{ width: 24, height: 24, tintColor: '#FFF' }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=8' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.lastLive}>Last live 5 years ago</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="radio-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Stream Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bar-chart-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
            {['Home', 'About', 'Clips', 'Videos', 'Schedule'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={styles.tabItem}
                onPress={() => handleTabPress(tab as TabType)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Animated underline */}
          <Animated.View
            style={[
              styles.animatedIndicator,
              {
                transform: [{
                  translateX: scrollProgress.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: [20, 96, 176, 256, 352], // Positions for each tab
                    extrapolate: 'clamp',
                  })
                }],
                width: scrollProgress.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: [48, 52, 46, 56, 72], // Widths: Home, About, Clips, Videos, Schedule
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Horizontal Scrollable Sections */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
          listener: handleScroll,
        })}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: 0, y: 0 }}
        style={styles.horizontalScroll}
      >
        {/* Home Section */}
        <View style={styles.pageContainer}>
          {renderEmptyState('This channel has no content', "It's quiet... too quiet...")}
        </View>

        {/* About Section */}
        <View style={styles.pageContainer}>
          <ScrollView style={styles.aboutContent}>
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.aboutText}>{user.bio || 'No bio added yet'}</Text>
            </View>
            {user.nationality && (
              <View style={styles.aboutSection}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.aboutText}>{user.nationality}</Text>
              </View>
            )}
            {user.languages && user.languages.length > 0 && (
              <View style={styles.aboutSection}>
                <Text style={styles.sectionTitle}>Languages</Text>
                <Text style={styles.aboutText}>{user.languages.join(', ')}</Text>
              </View>
            )}
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Followers</Text>
              <Text style={styles.aboutText}>{user.followers || 0}</Text>
            </View>
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Following</Text>
              <Text style={styles.aboutText}>{user.following || 0}</Text>
            </View>
          </ScrollView>
        </View>

        {/* Clips Section */}
        <View style={styles.pageContainer}>
          {renderEmptyState('No clips yet', 'Start creating clips from your streams')}
        </View>

        {/* Videos Section */}
        <View style={styles.pageContainer}>
          {renderEmptyState('No videos yet', 'Your past streams will appear here')}
        </View>

        {/* Schedule Section */}
        <View style={styles.pageContainer}>
          {renderEmptyState('No scheduled streams', 'Schedule your next stream to let viewers know when you go live')}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientHeader: {
    height: 120,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#000',
  },
  username: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  lastLive: {
    color: '#999',
    fontSize: 14,
    fontFamily: fonts.regular,
    marginBottom: 8,
  },
  bio: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  tabNavigation: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabContainer: {
    position: 'relative',
    paddingVertical: 12,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    gap: 24,
  },
  tabItem: {
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  tabText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  activeTabText: {
    color: '#FFF',
    fontFamily: fonts.bold,
  },
  animatedIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  horizontalScroll: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  aboutContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  aboutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  aboutText: {
    color: '#999',
    fontSize: 14,
    fontFamily: fonts.regular,
    lineHeight: 20,
  },
});

export default ProfileScreen;