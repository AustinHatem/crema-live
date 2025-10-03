# Crema Live - Live Streaming Platform

A TikTok-style live streaming app built with React Native and Expo, featuring real-time chat, virtual gifting, and social features.

## Features

### Core Features
- **TikTok-style Feed**: Vertical swipeable live stream viewer
- **Live Streaming**: Camera-based streaming with real-time chat
- **Virtual Gifting**: Send virtual gifts to streamers
- **User Profiles**: Customizable profiles with bio, nationality, and languages
- **Follow System**: Follow/unfollow users and view follower lists
- **Search**: Discover users and streams
- **Notifications**: Real-time notifications for follows and gifts
- **Settings**: Account management and privacy settings

### Authentication
- Email/password registration and login
- Age verification (13+ required)
- Firebase Authentication integration
- Profile management

### Social Features
- Real-time chat during streams
- User search and discovery
- Follow/unfollow functionality
- Stream sharing
- Notifications

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Navigation**: React Navigation
- **State Management**: React Context
- **Real-time Features**: Firebase Firestore listeners

## Setup Instructions

### Prerequisites
- Node.js (version 20.11.0 or higher)
- npm or yarn
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crema-live
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration
   - Update `src/services/firebase.ts` with your Firebase config:

   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device**
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in the terminal
   - Or run on emulator: `npm run ios` or `npm run android`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/         # Navigation configuration
│   ├── MainNavigator.tsx
│   └── RootNavigator.tsx
├── screens/           # App screens
│   ├── FeedScreen.tsx
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SearchScreen.tsx
│   ├── LiveScreen.tsx
│   ├── NotificationsScreen.tsx
│   ├── SettingsScreen.tsx
│   └── StreamViewScreen.tsx
├── services/          # External service integrations
│   ├── firebase.ts
│   ├── authService.ts
│   └── firestoreService.ts
├── store/            # State management
│   └── AuthContext.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
└── utils/            # Helper functions
```

## Firebase Collections Structure

### Users Collection (`users`)
```typescript
{
  id: string;
  username: string;
  displayName?: string;
  email: string;
  avatar?: string;
  bio?: string;
  nationality?: string;
  languages?: string[];
  followers: number;
  following: number;
  birthday?: string;
  createdAt: Date;
}
```

### Streams Collection (`streams`)
```typescript
{
  id: string;
  title: string;
  streamer: User;
  viewerCount: number;
  isLive: boolean;
  startedAt: Date;
  endedAt?: Date;
  category?: string;
  tags?: string[];
}
```

### Chat Messages Subcollection (`streams/{streamId}/chat`)
```typescript
{
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  gift?: Gift;
}
```

## Development Notes

### Important Firebase Rules
Make sure to set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }

    match /streams/{streamId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && resource.data.streamer.id == request.auth.uid;
    }

    match /streams/{streamId}/chat/{messageId} {
      allow read, create: if request.auth != null;
    }
  }
}
```

### Missing Features (Future Development)
- Real WebRTC video streaming
- Push notifications
- Video storage and replay
- Advanced search filters
- Stream categories
- Monetization features
- Admin panel
- Content moderation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@cremalive.com or join our Discord server.# crema-live
