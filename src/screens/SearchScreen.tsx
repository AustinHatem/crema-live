import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { User, Stream } from '../types';
import { mockUsers, mockStreams } from '../utils/mockData';
import { fonts, colors } from '../utils/globalStyles';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'streams'>('users');

  // Use mock data
  const [users] = useState<User[]>(mockUsers);
  const [streams] = useState<Stream[]>(mockStreams);

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
      <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
      <View style={styles.streamInfo}>
        <Text style={styles.streamTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.streamStreamer}>{item.streamer.displayName}</Text>
        <View style={styles.viewerContainer}>
          <Image
            source={require('../assets/icons/Eye-Outline-80px.png')}
            style={{ width: 12, height: 12, tintColor: '#999' }}
          />
          <Text style={styles.streamViewers}> {item.viewerCount} viewers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users or streams..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'streams' && styles.activeTab]}
          onPress={() => setActiveTab('streams')}
        >
          <Text style={[styles.tabText, activeTab === 'streams' && styles.activeTabText]}>
            Streams
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'users' ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No users found</Text>
          }
        />
      ) : (
        <FlatList
          data={filteredStreams}
          renderItem={renderStream}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No streams found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  activeTabText: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
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
    flex: 0.5,
    margin: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  streamThumbnail: {
    width: '100%',
    height: 100,
    backgroundColor: '#333',
  },
  streamInfo: {
    padding: 8,
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
    marginBottom: 4,
    fontFamily: fonts.regular,
  },
  streamViewers: {
    color: '#999',
    fontSize: 11,
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