import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Notification } from '../types';
import { mockNotifications } from '../utils/mockData';
import { fonts, colors } from '../utils/globalStyles';

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'follow':
        return <FontAwesome name="user" size={20} color="#FFF" />;
      case 'gift':
        return <AntDesign name="gift" size={20} color="#FFF" />;
      case 'stream_start':
        return <MaterialIcons name="play-circle-outline" size={20} color={colors.primary} />;
      case 'mention':
        return <Ionicons name="chatbubble-outline" size={20} color="#FFF" />;
      default:
        return <Ionicons name="notifications-outline" size={20} color="#FFF" />;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unread]}
      onPress={() => {
        markAsRead(item.id);
        if (item.userId) {
          navigation.navigate('UserProfile', { userId: item.userId });
        }
      }}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{getTimeAgo(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          }}
        >
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <NotificationIcon size={48} color="#999" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  markAllRead: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  listContent: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  unread: {
    backgroundColor: '#1a1a1a',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: fonts.medium,
  },
  notificationMessage: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: fonts.regular,
  },
  notificationTime: {
    color: '#666',
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
});

export default NotificationsScreen;