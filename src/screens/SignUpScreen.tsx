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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../store/AuthContext';
import { AuthService } from '../services/authService';
import { fonts } from '../utils/globalStyles';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(new Date());

  // Validation errors
  const [error, setError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Step configuration
  const steps = [
    {
      title: "What's your username?",
      subtitle: "Choose a unique username that represents you",
      value: username,
      setValue: setUsername,
      placeholder: "Username",
      autoCapitalize: "none",
      keyboardType: "default",
    },
    {
      title: "What's your email?",
      subtitle: "We'll use this to keep your account secure",
      value: email,
      setValue: setEmail,
      placeholder: "Email",
      autoCapitalize: "none",
      keyboardType: "email-address",
    },
    {
      title: "Create a password",
      subtitle: "Make it strong to keep your account safe",
      value: password,
      setValue: setPassword,
      placeholder: "Password",
      secureTextEntry: true,
    },
    {
      title: "When's your birthday?",
      subtitle: "This helps us create age-appropriate experiences",
      value: birthday,
      isDatePicker: true,
    },
  ];

  const validateStep = async (step: number): Promise<boolean> => {
    setError('');

    switch (step) {
      case 1:
        if (!username.trim()) {
          setError('Please enter a username');
          return false;
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          return false;
        }

        // Try to check username availability, but don't fail if we can't
        setCheckingUsername(true);
        try {
          const isAvailable = await AuthService.isUsernameAvailable(username);
          if (!isAvailable) {
            setError('Username is already taken');
            return false;
          }
        } catch (error: any) {
          console.log('Could not verify username availability:', error);
          // Continue without blocking - we'll catch conflicts during signup
        } finally {
          setCheckingUsername(false);
        }
        break;
      case 2:
        if (!email.trim()) {
          setError('Please enter an email');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      case 3:
        if (!password.trim()) {
          setError('Please enter a password');
          return false;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
      case 4:
        const age = new Date().getFullYear() - birthday.getFullYear();
        if (age < 13) {
          setError('You must be at least 13 years old to sign up');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (await validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSignUp();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password, username, birthday);
      // Navigation will be handled automatically by the auth state change
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header with navigation */}
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((step) => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  step <= currentStep ? styles.progressDotActive : styles.progressDotInactive
                ]}
              />
            ))}
          </View>

          <View style={styles.placeholder} />
        </View>

        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.questionTitle}>{currentStepData.title}</Text>
          <Text style={styles.questionSubtitle}>{currentStepData.subtitle}</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          {currentStepData.isDatePicker ? (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={birthday}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setBirthday(selectedDate);
                  }
                }}
                maximumDate={new Date()}
                style={styles.datePicker}
                textColor="#FFF"
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={currentStepData.placeholder}
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={currentStepData.value}
              onChangeText={currentStepData.setValue}
              autoCapitalize={currentStepData.autoCapitalize || "sentences"}
              keyboardType={currentStepData.keyboardType || "default"}
              secureTextEntry={currentStepData.secureTextEntry || false}
              underlineColorAndroid="transparent"
              autoFocus
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.continueButton, (loading || checkingUsername) && styles.disabledButton]}
            onPress={handleNext}
            disabled={loading || checkingUsername}
          >
            {loading || checkingUsername ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.continueButtonText}>
                {currentStep === 4 ? 'Create Account' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFF',
  },
  progressDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  placeholder: {
    width: 40,
  },
  questionSection: {
    alignItems: 'flex-start',
    paddingTop: 0,
    justifyContent: 'flex-start',
  },
  questionTitle: {
    color: '#FFF',
    fontSize: 38,
    fontFamily: fonts.bold,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 16,
    textAlign: 'left',
    lineHeight: 38,
    includeFontPadding: false,
  },
  questionSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontFamily: fonts.regular,
    textAlign: 'left',
    lineHeight: 26,
    marginBottom: 20,
  },
  inputSection: {
    justifyContent: 'flex-start',
    paddingVertical: 0,
    marginTop: 0,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 20,
    color: '#FFF',
    fontSize: 18,
    fontFamily: fonts.regular,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  datePickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  datePicker: {
    height: 200,
    width: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  buttonSection: {
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default SignUpScreen;