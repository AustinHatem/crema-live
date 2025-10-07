import React, { useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar, Animated, ScrollView } from "react-native";
import { Stream } from "../types";
import { useNavigation } from "@react-navigation/native";
import { mockStreams, mockCurrentUser } from "../utils/mockData";
import { fonts, colors } from "../utils/globalStyles";
import TabHeader from "../components/TabHeader";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"Following" | "Live">("Live");
  const scrollRef = useRef<ScrollView>(null);

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

  const renderStream = ({ item }: { item: Stream }) => {
    return (
      <View style={styles.streamContainer}>
        <TouchableOpacity style={styles.videoPlaceholder} onPress={() => navigation.navigate("StreamView", { streamId: item.id })}>
          <Image source={{ uri: `https://picsum.photos/400/800?random=${item.id}` }} style={styles.thumbnail} />
        </TouchableOpacity>

        <View style={styles.overlay}>
          <View style={styles.footer}>
            <View style={styles.streamInfo}>
              <Text style={styles.streamerName}>{item.streamer.displayName}</Text>
              <Text style={styles.streamTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate("UserProfile", { userId: item.streamer.id })}>
              <Image source={{ uri: item.streamer.avatar }} style={styles.avatar} />
              <View style={styles.liveIndicator}>
                <Text style={styles.liveText}>LIVE</Text>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Tab Header */}
      <View style={styles.header}>
        <TabHeader activeTab={activeTab} onTabPress={handleTabPress} scrollProgress={scrollProgress} />
      </View>

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
    zIndex: 10,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFF",
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
});

export default FeedScreen;
