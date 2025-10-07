import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../store/AuthContext';
import { fonts, colors } from '../utils/globalStyles';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  if (!user) {
    return null; // This shouldn't happen as the user should be authenticated
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Image
              source={require('../assets/icons/Settings.png')}
              style={{ width: 24, height: 24, tintColor: '#FFF' }}
            />
          </TouchableOpacity>
        </View>

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

          <View style={styles.details}>
            {user.nationality && (
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🌍</Text>
                <Text style={styles.detailText}>{user.nationality}</Text>
              </View>
            )}
            {user.languages && user.languages.length > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="chatbubble-outline" size={16} color="#999" style={{ marginRight: 4 }} />
                <Text style={styles.detailText}>{user.languages.join(', ')}</Text>
              </View>
            )}
          </View>

          <View style={styles.stats}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowersList', {
                userId: user.id,
                type: 'followers'
              })}
            >
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowersList', {
                userId: user.id,
                type: 'following'
              })}
            >
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="videocam" size={28} color="#FFF" />
              <Text style={styles.quickActionText}>Go Live</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="people" size={28} color="#FFF" />
              <Text style={styles.quickActionText}>Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="analytics" size={28} color="#FFF" />
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <FontAwesome5 name="dollar-sign" size={28} color="#FFF" />
              <Text style={styles.quickActionText}>Earnings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Streams</Text>
          <Text style={styles.emptyText}>No recent streams</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  settingsButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  displayName: {
    color: '#FFF',
    fontSize: 24,
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
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
    fontFamily: fonts.regular,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#999',
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
    fontFamily: fonts.regular,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 16,
    fontFamily: fonts.bold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flex: 0.23,
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: fonts.medium,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.regular,
  },
});

export default ProfileScreen;