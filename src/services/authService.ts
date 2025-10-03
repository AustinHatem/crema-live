import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, username: string, birthday: Date): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: username,
      });

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        username,
        displayName: username,
        email,
        birthday: birthday.toISOString(),
        followers: 0,
        following: 0,
        createdAt: new Date(),
      };

      // Try to create the user document
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      } catch (firestoreError: any) {
        // If there's a duplicate username issue, clean up the auth account
        await firebaseUser.delete();
        if (firestoreError.code === 'already-exists') {
          throw new Error('Username is already taken');
        }
        throw firestoreError;
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error('User data not found');
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), updates);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Check if username is available (creates a temporary anonymous user to check)
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      // For now, we'll do a simple check during signup. In production, you might want
      // to implement a cloud function or use a different approach
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      console.log('Username check result:', { username, isEmpty: querySnapshot.empty, size: querySnapshot.size });
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking username availability:', error);
      // If we can't check, assume it's available and let the signup process handle conflicts
      return true;
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}