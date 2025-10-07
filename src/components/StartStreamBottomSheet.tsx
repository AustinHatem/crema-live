import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { fonts, colors } from '../utils/globalStyles';
import { FirestoreService } from '../services/firestoreService';
import { useAuth } from '../store/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface StartStreamBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface StartStreamBottomSheetProps {
  onStreamCreated?: (streamId: string) => void;
}

const StartStreamBottomSheet = forwardRef<StartStreamBottomSheetRef, StartStreamBottomSheetProps>(
  ({ onStreamCreated }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const { currentUser } = useAuth();

    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.expand(),
      dismiss: () => bottomSheetRef.current?.close(),
    }));

    const handleClose = () => {
      bottomSheetRef.current?.close();
      // Reset form
      setTimeout(() => {
        setTitle('');
        setDescription('');
      }, 300);
    };

    const handleGoLive = async () => {
      if (!title.trim()) {
        Alert.alert('Error', 'Please enter a stream title');
        return;
      }

      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to start a stream');
        return;
      }

      setIsCreating(true);

      try {
        const streamData = {
          title: title.trim(),
          description: description.trim() || undefined,
          thumbnail: `https://picsum.photos/400/800?random=${Date.now()}`,
          viewerCount: 0,
          streamer: {
            id: currentUser.uid,
            username: currentUser.email?.split('@')[0] || 'user',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || '',
            avatar: currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`,
            bio: '',
            nationality: '',
            languages: [],
            followers: 0,
            following: 0,
            createdAt: new Date(),
          },
          startedAt: new Date(),
          category: 'General',
          tags: [],
          isLive: true,
        };

        const streamId = await FirestoreService.createStream(streamData);

        handleClose();

        if (onStreamCreated) {
          onStreamCreated(streamId);
        }

        Alert.alert('Success', 'Stream created! You are now live!');
      } catch (error: any) {
        console.error('Error creating stream:', error);
        Alert.alert('Error', error.message || 'Failed to create stream');
      } finally {
        setIsCreating(false);
      }
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['100%']}
        enablePanDownToClose={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={{ opacity: 0, height: 0 }}
        handleHeight={0}
        style={{ zIndex: 1000 }}
      >
        <BottomSheetView style={[styles.contentContainer, { paddingTop: insets.top + 16 }]}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
          >
            <Ionicons name="chevron-down" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Start Stream</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Enter stream title..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={title}
                onChangeText={(text) => {
                  if (text.length <= 130) {
                    setTitle(text);
                  }
                }}
                maxLength={130}
                editable={!isCreating}
              />
              <Text style={styles.charCount}>{title.length}/130</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <BottomSheetTextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter stream description..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={description}
                onChangeText={(text) => {
                  if (text.length <= 140) {
                    setDescription(text);
                  }
                }}
                maxLength={140}
                multiline
                numberOfLines={3}
                editable={!isCreating}
              />
              <Text style={styles.charCount}>{description.length}/140</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                disabled={isCreating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.goLiveButton, isCreating && styles.buttonDisabled]}
                onPress={handleGoLive}
                disabled={isCreating || !title.trim()}
              >
                <Text style={styles.goLiveButtonText}>
                  {isCreating ? 'Creating...' : 'Go Live'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#000',
  },
  handleIndicator: {
    backgroundColor: '#333',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: '#FFF',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#FFF',
  },
  goLiveButton: {
    backgroundColor: colors.primary,
  },
  goLiveButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default StartStreamBottomSheet;
