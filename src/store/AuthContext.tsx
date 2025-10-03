import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockCurrentUser } from '../utils/mockData';
import { AuthService } from '../services/authService';

// Mock mode - set to false when you want to use real Firebase
const MOCK_MODE = true;

interface AuthContextType {
  user: User | null;
  firebaseUser: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, birthday: Date) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (MOCK_MODE) {
      // Simulate loading and auto-login with mock user
      setTimeout(() => {
        setUser(mockCurrentUser);
        setFirebaseUser({ uid: mockCurrentUser.id });
        setLoading(false);
      }, 1000);
    } else {
      // Real Firebase authentication
      const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
        setFirebaseUser(firebaseUser);

        if (firebaseUser) {
          try {
            const userData = await AuthService.getUserData(firebaseUser.uid);
            setUser(userData);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      });

      return unsubscribe;
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (MOCK_MODE) {
      // Mock sign in - just set the user
      setUser(mockCurrentUser);
      setFirebaseUser({ uid: mockCurrentUser.id });
    } else {
      // Real Firebase authentication
      try {
        const userData = await AuthService.signIn(email, password);
        // User state will be updated by the onAuthStateChanged listener
      } catch (error: any) {
        throw error;
      }
    }
  };

  const signUp = async (email: string, password: string, username: string, birthday: Date) => {
    if (MOCK_MODE) {
      // Mock sign up - create a new user with provided data
      const newUser: User = {
        ...mockCurrentUser,
        username,
        displayName: username,
        email,
        birthday: birthday.toISOString(),
      };
      setUser(newUser);
      setFirebaseUser({ uid: newUser.id });
    } else {
      // Real Firebase authentication
      try {
        const userData = await AuthService.signUp(email, password, username, birthday);
        // User state will be updated by the onAuthStateChanged listener
      } catch (error: any) {
        throw error;
      }
    }
  };

  const signOut = async () => {
    if (MOCK_MODE) {
      // Mock sign out
      setUser(null);
      setFirebaseUser(null);
    } else {
      // Real Firebase authentication
      try {
        await AuthService.signOut();
        // User state will be updated by the onAuthStateChanged listener
      } catch (error: any) {
        throw error;
      }
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (MOCK_MODE) {
      // Mock update - just update local state
      if (user) {
        setUser({ ...user, ...updates });
      }
    } else {
      // Real Firebase authentication
      try {
        if (user) {
          await AuthService.updateUserProfile(user.id, updates);
          setUser({ ...user, ...updates });
        }
      } catch (error: any) {
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};