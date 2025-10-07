import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from '../types';
import { fonts, colors } from '../utils/globalStyles';

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // For now, we'll use mock data. In a real app, you'd fetch user data by userId
    const mockUser: User = {
      id: userId,
      username: 'user_' + userId.slice(-4),
      displayName: 'Sample User',
      email: 'user@example.com',
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      createdAt: new Date(),
      birthday: '1990-01-01',
      bio: 'Live streaming enthusiast 🎮',
      nationality: 'United States',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };

    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you'd make an API call to follow/unfollow the user
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icons/ChevronLeft.png')}
            style={{ width: 24, height: 24, tintColor: '#FFF' }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=8' }}
            style={styles.avatar}
          />
          <Text style={styles.displayName}>{user.displayName || user.username}</Text>
          <Text style={styles.username}>@{user.username}</Text>

          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
    fontFamily: fonts.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  placeholder: {
    width: 40,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  displayName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: fonts.bold,
  },
  username: {
    color: '#999',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: fonts.regular,
  },
  bio: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: fonts.regular,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  followButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  followingButton: {
    backgroundColor: '#333',
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.bold,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});

export default UserProfileScreen;