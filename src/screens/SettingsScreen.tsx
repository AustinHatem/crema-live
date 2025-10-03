import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../store/AuthContext';
import { fonts, colors } from '../utils/globalStyles';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [privateAccount, setPrivateAccount] = React.useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            // Handle account deletion
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await signOut();
              // Navigation will be handled automatically by auth state change
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          label: 'Edit Profile',
          icon: '👤',
          onPress: () => {},
        },
        {
          label: 'Change Password',
          icon: '🔐',
          onPress: () => {},
        },
        {
          label: 'Private Account',
          icon: '🔒',
          toggle: true,
          value: privateAccount,
          onValueChange: setPrivateAccount,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push Notifications',
          icon: '🔔',
          toggle: true,
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          label: 'Notification Settings',
          icon: '⚙️',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Content',
      items: [
        {
          label: 'Stream Quality',
          icon: '📺',
          onPress: () => {},
        },
        {
          label: 'Language',
          icon: '🌐',
          onPress: () => {},
        },
        {
          label: 'Blocked Users',
          icon: '🚫',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          label: 'Terms of Service',
          icon: '📄',
          onPress: () => {},
        },
        {
          label: 'Privacy Policy',
          icon: '🔒',
          onPress: () => {},
        },
        {
          label: 'Community Guidelines',
          icon: '📖',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          label: 'Help Center',
          icon: '❓',
          onPress: () => {},
        },
        {
          label: 'Report a Problem',
          icon: '⚠️',
          onPress: () => {},
        },
        {
          label: 'Contact Us',
          icon: '✉️',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.settingItem}
                onPress={item.toggle ? undefined : item.onPress}
                activeOpacity={item.toggle ? 1 : 0.7}
              >
                <View style={styles.settingLeft}>
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onValueChange}
                    trackColor={{ false: '#333', true: colors.primary }}
                    thumbColor="#FFF"
                  />
                ) : (
                  <Text style={styles.arrow}>→</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
            <Text style={styles.dangerButtonText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.dangerButtonText, styles.deleteButtonText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: fonts.regular,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    fontFamily: fonts.medium,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  arrow: {
    color: '#666',
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  dangerZone: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  dangerButton: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: colors.primary,
  },
  dangerButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: fonts.medium,
  },
  deleteButtonText: {
    color: '#FFF',
  },
  version: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    fontFamily: fonts.regular,
  },
});

export default SettingsScreen;