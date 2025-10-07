import React, { useState, useRef, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar, Animated, ScrollView, TextInput } from "react-native";
import { Stream, ChatMessage } from "../types";
import { useNavigation } from "@react-navigation/native";
import { mockStreams, mockCurrentUser, mockChatMessages } from "../utils/mockData";
import { fonts, colors } from "../utils/globalStyles";
import TabHeader from "../components/TabHeader";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"Following" | "Live">("Live");
  const scrollRef = useRef<ScrollView>(null);

  // Bottom sheet state
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const chatFlatListRef = useRef<FlatList>(null);
  const snapPoints = useMemo(() => ['95%'], []);

  // Animated value for tab underline (0 = Following, 1 = Live)
  const scrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Use mock data for streams
  const [streams] = useState<Stream[]>(mockStreams);

  // Filter streams based on active tab
  const followingStreams = streams.filter((stream) =>
    mockCurrentUser.followingUserIds?.includes(stream.streamer.id)
  );
  const liveStreams = streams;

  // Create scroll progress for tab underline (0 = Following, 1 = Live)
  const scrollProgress = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleStreamPress = (stream: Stream) => {
    setSelectedStream(stream);
    setIsSheetOpen(true);
    bottomSheetRef.current?.expand();
  };

  const renderStream = ({ item }: { item: Stream }) => {
    return (
      <View style={styles.streamContainer}>
        <TouchableOpacity style={styles.videoPlaceholder} onPress={() => handleStreamPress(item)}>
          <Image source={{ uri: `https://picsum.photos/400/800?random=${item.id}` }} style={styles.thumbnail} />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <View style={styles.footer}>
            <View style={styles.streamInfo}>
              <Text style={styles.streamerName}>{item.streamer.displayName}</Text>
              <Text style={styles.streamTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate("UserProfile", { userId: item.streamer.id })}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: item.streamer.avatar }} style={styles.avatar} />
                <View style={styles.liveIndicator}>
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.viewerCount}>
                <Image
                  source={require('../assets/icons/Eye.png')}
                  style={{ width: 16, height: 16, tintColor: '#FFF' }}
                />
                <Text style={styles.viewerText}> {item.viewerCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleTabPress = (tab: "Following" | "Live") => {
    setActiveTab(tab);
    const pageIndex = tab === "Following" ? 0 : 1;
    scrollRef.current?.scrollTo({ x: pageIndex * SCREEN_WIDTH, animated: true });
  };

  const handleScroll = (event: any) => {
    const scrollXValue = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(scrollXValue / SCREEN_WIDTH);
    const newTab = pageIndex === 0 ? "Following" : "Live";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const renderFeedList = (data: Stream[]) => (
    <View style={styles.pageContainer}>
      <FlatList
        data={data}
        renderItem={renderStream}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        nestedScrollEnabled={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedStream) return;

    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      userId: mockCurrentUser.id,
      username: mockCurrentUser.username,
      avatar: mockCurrentUser.avatar,
      text: message.trim(),
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage('');

    setTimeout(() => {
      chatFlatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Horizontal ScrollView with two FlatLists */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: handleScroll,
          }
        )}
        onMomentumScrollEnd={handleScroll}
        contentOffset={{ x: SCREEN_WIDTH, y: 0 }}
      >
        {renderFeedList(followingStreams)}
        {renderFeedList(liveStreams)}
      </ScrollView>

      {/* Tab Header */}
      <View style={styles.header}>
        <TabHeader activeTab={activeTab} onTabPress={handleTabPress} scrollProgress={scrollProgress} />
      </View>

      {/* Stream View Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        containerStyle={{ zIndex: 100000, elevation: 100000 }}
        onChange={(index) => {
          if (index === -1) {
            setIsSheetOpen(false);
          }
        }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selectedStream && (
            <>
              {/* Stream Background */}
              <Image
                source={{ uri: `https://picsum.photos/400/800?random=${selectedStream.id}` }}
                style={styles.streamBackground}
              />

              {/* Header with close button */}
              <View style={styles.sheetHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setIsSheetOpen(false);
                    bottomSheetRef.current?.close();
                  }}
                >
                  <Ionicons name="chevron-down" size={28} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Chat overlay */}
              <View style={styles.chatOverlay}>
                <FlatList
                  ref={chatFlatListRef}
                  data={chatMessages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.chatMessage}>
                      <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
                      <View style={styles.chatBubble}>
                        <Text style={styles.chatUsername}>{item.username}</Text>
                        <Text style={styles.chatText}>{item.text}</Text>
                      </View>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.chatList}
                />
              </View>

              {/* Stream info footer */}
              <View style={styles.streamFooter}>
                <View style={styles.streamInfoBottom}>
                  <View style={styles.streamerInfoRow}>
                    <Image source={{ uri: selectedStream.streamer.avatar }} style={styles.bottomAvatar} />
                    <View>
                      <Text style={styles.bottomStreamerName}>{selectedStream.streamer.displayName}</Text>
                      <Text style={styles.bottomStreamTitle}>{selectedStream.title}</Text>
                    </View>
                  </View>
                  <View style={styles.viewerCountBottom}>
                    <Image
                      source={require('../assets/icons/Eye.png')}
                      style={{ width: 16, height: 16, tintColor: '#FFF' }}
                    />
                    <Text style={styles.viewerText}> {selectedStream.viewerCount}</Text>
                  </View>
                </View>

                {/* Message input */}
                <View style={styles.messageInputContainer}>
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Send a message..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSendMessage}
                    returnKeyType="send"
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                  >
                    <Ionicons name="send" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  streamContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  videoPlaceholder: {
    flex: 1,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  liveIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    position: "absolute",
    bottom: -2,
    left: 0,
    right: 0,
    alignSelf: "center",
  },
  liveText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  viewerCount: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  viewerText: {
    color: "#FFF",
    fontWeight: "600",
    fontFamily: fonts.medium,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 110,
  },
  streamInfo: {
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 6,
  },
  avatarWrapper: {
    position: "relative",
    width: 48,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  streamerName: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  streamTitle: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 2,
    fontFamily: fonts.regular,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  bottomSheetBackground: {
    backgroundColor: "#000",
  },
  handleIndicator: {
    backgroundColor: "#333",
  },
  sheetContent: {
    flex: 1,
  },
  streamBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatOverlay: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 60,
  },
  chatList: {
    paddingBottom: 20,
  },
  chatMessage: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  chatBubble: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: "75%",
  },
  chatUsername: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  chatText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  streamFooter: {
    padding: 16,
    paddingBottom: 120,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  streamInfoBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  streamerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bottomAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  bottomStreamerName: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  bottomStreamTitle: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: fonts.regular,
    opacity: 0.8,
  },
  viewerCountBottom: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(42,41,46,0.9)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default FeedScreen;
