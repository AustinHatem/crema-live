import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChatMessage, Gift } from '../types';
import { mockChatMessages } from '../utils/mockData';
import { fonts, colors } from '../utils/globalStyles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const StreamViewScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  const gifts: Gift[] = [
    { id: '1', name: 'Heart', icon: '❤️', price: 1 },
    { id: '2', name: 'Rose', icon: '🌹', price: 5 },
    { id: '3', name: 'Diamond', icon: '💎', price: 10 },
    { id: '4', name: 'Crown', icon: '👑', price: 50 },
    { id: '5', name: 'Rocket', icon: '🚀', price: 100 },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current',
      username: 'You',
      message: message,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
    flatListRef.current?.scrollToEnd();
  };

  const sendGift = (gift: Gift) => {
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current',
      username: 'You',
      message: `Sent a ${gift.name}`,
      gift: gift,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, giftMessage]);
    // Handle gift purchase logic here
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.chatMessage}>
      <View style={styles.chatBubble}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${item.userId}` }}
          style={styles.chatAvatar}
        />
        <View style={styles.chatContent}>
          <Text style={styles.chatText}>
            {item.username === 'You' ? item.message : `${item.username}: ${item.message}`}
          </Text>
          {item.gift && <Text style={styles.giftIcon}>{item.gift.icon}</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://picsum.photos/400/800?random=1' }}
        style={styles.video}
      />

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../assets/icons/X.png')}
          style={{ width: 20, height: 20, tintColor: '#FFF' }}
        />
      </TouchableOpacity>

      {/* Chat overlay on left side */}
      <View style={styles.chatOverlay}>
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderChatMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          showsVerticalScrollIndicator={true}
          inverted={false}
          scrollEnabled={true}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        {/* Fade mask at top - fades chat messages */}
        <View style={styles.chatGradient} pointerEvents="none" />
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Add Comment..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../assets/icons/Plus.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  chatOverlay: {
    position: 'absolute',
    left: 20,
    top: 100,
    bottom: 120,
    width: '65%',
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden',
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  chatGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  chatMessage: {
    marginBottom: 8,
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  chatContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  chatText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  giftIcon: {
    marginLeft: 4,
    fontSize: 16,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
});

export default StreamViewScreen;