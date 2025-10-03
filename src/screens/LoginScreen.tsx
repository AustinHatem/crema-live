import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../store/AuthContext';
import { fonts } from '../utils/globalStyles';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled automatically by the auth state change
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      <Video
        source={require('../assets/images/intro.mov')}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>CREMA{'\n'}LIVE*</Text>
            <Text style={styles.subtitle}>
              connect with people all over the globe in real-time
            </Text>
          </View>

          <View style={styles.form}>
            {!showLoginForm ? (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton]}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  <Text style={styles.primaryButtonText}>Sign up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => setShowLoginForm(true)}
                >
                  <Text style={styles.secondaryButtonText}>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => signIn('test@example.com', 'password')}
                >
                  <Text style={styles.testButtonText}>Continue (Test)</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.loginForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  underlineColorAndroid="transparent"
                />

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#333" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowLoginForm(false)}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.termsText}>
              By Creating Account you Accept{'\n'}
              <Text style={styles.linkText}>Terms of Use</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 20,
    overflow: 'visible',
    width: '100%',
  },
  title: {
    color: '#FFF',
    fontSize: 54,
    fontFamily: fonts.bold,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 16,
    textAlign: 'left',
    lineHeight: 54,
    includeFontPadding: false,
    textAlignVertical: 'top',
    width: '100%',
    flexShrink: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    fontFamily: fonts.regular,
    textAlign: 'left',
    lineHeight: 26,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  loginForm: {
    width: '100%',
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontFamily: fonts.medium,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: fonts.medium,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    marginBottom: 16,
    fontFamily: fonts.regular,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  loginButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 17,
    fontFamily: fonts.medium,
  },
  termsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: fonts.medium,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  testButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontFamily: fonts.regular,
  },
});

export default LoginScreen;