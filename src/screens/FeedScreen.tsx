import React, { useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Stream } from "../types";
import { useNavigation } from "@react-navigation/native";
import { mockStreams } from "../utils/mockData";
import { fonts, colors } from "../utils/globalStyles";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use mock data for streams
  const [streams] = useState<Stream[]>(mockStreams);

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
                  source={require('../assets/icons/Eye-Outline-80px.png')}
                  style={{ width: 12, height: 12, tintColor: '#FFF' }}
                />
                <Text style={styles.viewerText}> {item.viewerCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={streams}
        renderItem={renderStream}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
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
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 50,
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
    paddingBottom: 110, // Adjusted for 85px nav bar height
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
