export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  nationality?: string;
  languages?: string[];
  profilePictures?: string[];
  followers: number;
  following: number;
  isFollowing?: boolean;
  isStreaming?: boolean;
  birthday?: string;
  email?: string;
  createdAt: Date;
}

export interface Stream {
  id: string;
  title: string;
  thumbnail?: string;
  viewerCount: number;
  streamer: User;
  startedAt: Date;
  category?: string;
  tags?: string[];
  isLive: boolean;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  animation?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  gift?: Gift;
}

export interface Notification {
  id: string;
  type: 'follow' | 'gift' | 'stream_start' | 'mention';
  title: string;
  message: string;
  userId?: string;
  read: boolean;
  createdAt: Date;
}

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  SignUp: undefined;
  Login: undefined;
  StreamView: { streamId: string };
  UserProfile: { userId: string };
  Settings: undefined;
  FollowersList: { userId: string; type: 'followers' | 'following' };
};

export type MainTabParamList = {
  Feed: undefined;
  Search: undefined;
  Live: undefined;
  Notifications: undefined;
  Profile: undefined;
};