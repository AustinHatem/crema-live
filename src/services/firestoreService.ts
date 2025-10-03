import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Stream, User, ChatMessage, Notification } from '../types';

export class FirestoreService {
  // Streams
  static async createStream(streamData: Omit<Stream, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'streams'), {
        ...streamData,
        startedAt: Timestamp.fromDate(streamData.startedAt),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getStream(streamId: string): Promise<Stream | null> {
    try {
      const streamDoc = await getDoc(doc(db, 'streams', streamId));
      if (streamDoc.exists()) {
        const data = streamDoc.data();
        return {
          ...data,
          id: streamDoc.id,
          startedAt: data.startedAt.toDate(),
        } as Stream;
      }
      return null;
    } catch (error) {
      console.error('Error getting stream:', error);
      return null;
    }
  }

  static async getLiveStreams(): Promise<Stream[]> {
    try {
      const q = query(
        collection(db, 'streams'),
        where('isLive', '==', true),
        orderBy('startedAt', 'desc'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startedAt: doc.data().startedAt.toDate(),
      })) as Stream[];
    } catch (error) {
      console.error('Error getting live streams:', error);
      return [];
    }
  }

  static async updateStreamViewerCount(streamId: string, count: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'streams', streamId), {
        viewerCount: count,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async endStream(streamId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'streams', streamId), {
        isLive: false,
        endedAt: Timestamp.now(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Chat Messages
  static async sendChatMessage(streamId: string, message: Omit<ChatMessage, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'streams', streamId, 'chat'), {
        ...message,
        timestamp: Timestamp.fromDate(message.timestamp),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static listenToChatMessages(
    streamId: string,
    callback: (messages: ChatMessage[]) => void
  ) {
    const q = query(
      collection(db, 'streams', streamId, 'chat'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data().timestamp.toDate(),
      })) as ChatMessage[];
      callback(messages);
    });
  }

  // Follow/Unfollow
  static async followUser(currentUserId: string, targetUserId: string): Promise<void> {
    try {
      // Add to current user's following list
      await updateDoc(doc(db, 'users', currentUserId), {
        following: increment(1),
      });

      // Add to target user's followers list
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: increment(1),
      });

      // Create a follow relationship document
      await addDoc(collection(db, 'follows'), {
        followerId: currentUserId,
        followingId: targetUserId,
        createdAt: Timestamp.now(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    try {
      // Remove from current user's following list
      await updateDoc(doc(db, 'users', currentUserId), {
        following: increment(-1),
      });

      // Remove from target user's followers list
      await updateDoc(doc(db, 'users', targetUserId), {
        followers: increment(-1),
      });

      // Delete the follow relationship document
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', currentUserId),
        where('followingId', '==', targetUserId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', currentUserId),
        where('followingId', '==', targetUserId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  // Search
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('username', '>=', searchTerm),
        where('username', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as User[];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Notifications
  static async createNotification(notification: Omit<Notification, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: Timestamp.fromDate(notification.createdAt),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      })) as Notification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}