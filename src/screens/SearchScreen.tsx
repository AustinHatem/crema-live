import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Stream } from '../types';
import { mockUsers, mockStreams } from '../utils/mockData';
import { fonts, colors } from '../utils/globalStyles';
import TabHeader from '../components/TabHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Users' | 'Streams'>('Streams');
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Use mock data
  const [users] = useState<User[]>(mockUsers);
  const [streams] = useState<Stream[]>(mockStreams);

  // Create scroll progress for tab underline (0 = Users, 1 = Streams)
  const scrollProgress = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleTabPress = (tab: 'Users' | 'Streams') => {
    setActiveTab(tab);
    const pageIndex = tab === 'Streams' ? 0 : 1;
    scrollRef.current?.scrollTo({ x: pageIndex * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (event: any) => {
    const scrollXValue = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollXValue / SCREEN_WIDTH);
    const newTab = pageIndex === 0 ? 'Streams' : 'Users';
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStreams = streams.filter((stream) =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.streamer.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userHandle}>@{item.username}</Text>
        <Text style={styles.userStats}>{item.followers} followers</Text>
      </View>
      {item.isStreaming && (
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderStream = ({ item }: { item: Stream }) => (
    <TouchableOpacity
      style={styles.streamItem}
      onPress={() => navigation.navigate('StreamView', { streamId: item.id })}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
        <View style={styles.viewerBadge}>
          <Image
            source={require('../assets/icons/Eye.png')}
            style={{ width: 12, height: 12, tintColor: '#FFF' }}
          />
          <Text style={styles.viewerBadgeText}> {item.viewerCount}</Text>
        </View>
      </View>
      <View style={styles.streamInfoSingle}>
        <Text style={styles.streamTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.streamStreamer}>{item.streamer.displayName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tab Header */}
      <View style={styles.header}>
        <TabHeader
          activeTab={activeTab}
          onTabPress={handleTabPress}
          scrollProgress={scrollProgress}
          leftTab="Streams"
          rightTab="Users"
          leftTabWidth={68}
          rightTabWidth={52}
        />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users or streams..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Horizontal ScrollView with two sections */}
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
        style={styles.scrollView}
      >
        {/* Streams Section */}
        <View style={styles.pageContainer}>
          <FlatList
            data={filteredStreams}
            renderItem={renderStream}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No streams found</Text>}
          />
        </View>

        {/* Users Section */}
        <View style={styles.pageContainer}>
          <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No users found</Text>}
          />
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
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 110,
    paddingBottom: 12,
    backgroundColor: '#000',
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  userHandle: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  userStats: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    fontFamily: fonts.regular,
  },
  liveIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  streamItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  thumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 90,
  },
  streamThumbnail: {
    width: 120,
    height: 90,
    backgroundColor: '#333',
  },
  viewerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  viewerBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: fonts.medium,
  },
  streamInfo: {
    padding: 8,
  },
  streamInfoSingle: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  streamTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: fonts.medium,
  },
  streamStreamer: {
    color: '#999',
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});

export default SearchScreen;