import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { fonts, colors } from '../utils/globalStyles';

const LiveScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.front);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startStreaming = () => {
    Alert.alert(
      'Start Streaming',
      'Are you ready to go live?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go Live',
          onPress: () => {
            setIsStreaming(true);
            // Here you would connect to your streaming service
          },
        },
      ]
    );
  };

  const stopStreaming = () => {
    Alert.alert(
      'End Stream',
      'Are you sure you want to end your stream?',
      [
        { text: 'Continue Streaming', style: 'cancel' },
        {
          text: 'End Stream',
          onPress: () => {
            setIsStreaming(false);
            // Disconnect from streaming service
          },
          style: 'destructive',
        },
      ]
    );
  };

  const toggleCameraType = () => {
    setCameraType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Text style={styles.subtext}>
          Please enable camera permissions in your device settings
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={cameraType}>
        <View style={styles.overlay}>
          {isStreaming && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
              <Text style={styles.viewerCount}>0 viewers</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={24} color="#FFF" />
            </TouchableOpacity>

            {!isStreaming ? (
              <TouchableOpacity
                style={[styles.goLiveButton]}
                onPress={startStreaming}
              >
                <Text style={styles.goLiveText}>GO LIVE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.goLiveButton, styles.endStreamButton]}
                onPress={stopStreaming}
              >
                <Text style={styles.goLiveText}>END STREAM</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.controlButton}>
              <Image
                source={require('../assets/icons/Setting2-Bold-80px.png')}
                style={{ width: 24, height: 24, tintColor: '#FFF' }}
              />
            </TouchableOpacity>
          </View>

          {!isStreaming && (
            <View style={styles.setupContainer}>
              <Text style={styles.setupTitle}>Ready to stream?</Text>
              <Text style={styles.setupSubtitle}>
                Tap "Go Live" to start broadcasting to your followers
              </Text>
            </View>
          )}
        </View>
      </Camera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignSelf: 'flex-start',
    margin: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  liveText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
    fontFamily: fonts.bold,
  },
  viewerCount: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
  },
  goLiveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  endStreamButton: {
    backgroundColor: '#333',
  },
  goLiveText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  setupContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  setupTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: fonts.bold,
  },
  setupSubtitle: {
    color: '#CCC',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fonts.regular,
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: fonts.regular,
  },
  subtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: fonts.regular,
  },
});

export default LiveScreen;