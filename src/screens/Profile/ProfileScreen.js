import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  Switch,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../App';
import { userData } from '../../utils/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 200;

const ProfileScreen = ({ navigation }) => {
  // State management
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [preferences, setPreferences] = useState({
    documentUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    darkMode: false
  });
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const tabFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  
  const { signOut } = useAuth();
  
  // Fetch user profile (using mock data)
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would make an API call to fetch the user profile
        // For this mockup, we'll just use the static userData
        setTimeout(() => {
          setUser(userData);
          setIsLoading(false);
          
          // Start animations
          Animated.parallel([
            Animated.timing(tabFade, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true
            }),
            Animated.timing(contentFade, {
              toValue: 1, 
              duration: 600,
              delay: 200,
              useNativeDriver: true
            })
          ]).start();
        }, 500);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return '??';
    return user.fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Handle logout
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: () => {
            signOut();
          }
        }
      ]
    );
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone, and all your data will be permanently removed.",
      [
        { text: "Cancel", onPress: () => setShowDeleteConfirm(false), style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            // In a real app, you would make an API call to delete the account
            Alert.alert(
              "Account Deleted",
              "Your account has been deleted successfully",
              [{ text: "OK", onPress: () => signOut() }]
            );
          },
          style: "destructive" 
        }
      ]
    );
  };
  
  // Toggle preference
  const togglePreference = (key) => {
    Haptics.selectionAsync();
    
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  // Fix: Changed headerHeight to use height style directly instead of animated
  // We'll use the translateY for animation which is supported by the native driver
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + 80],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp'
  });
  
  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0.6],
    extrapolate: 'clamp'
  });
  
  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -30],
    extrapolate: 'clamp'
  });
  
  const avatarTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -width / 3 + 20],
    extrapolate: 'clamp'
  });
  
  const nameTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -30],
    extrapolate: 'clamp'
  });
  
  const nameTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, 20],
    extrapolate: 'clamp'
  });
  
  const nameScale = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });
  
  const tabBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT + 80],
    extrapolate: 'clamp'
  });

  // Loading state
  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <LinearGradient
          colors={['#4f46e5', '#818cf8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loadingLogo}
        >
          <Text style={styles.loadingLogoText}>CDC</Text>
        </LinearGradient>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Section component with animation
  const ProfileSection = ({ title, children, delay = 0 }) => {
    const sectionFade = useRef(new Animated.Value(0)).current;
    const sectionTranslate = useRef(new Animated.Value(20)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(sectionFade, {
          toValue: 1,
          duration: 500,
          delay: 100 + delay,
          useNativeDriver: true
        }),
        Animated.timing(sectionTranslate, {
          toValue: 0,
          duration: 500,
          delay: 100 + delay,
          useNativeDriver: true
        })
      ]).start();
    }, []);
    
    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: sectionFade,
            transform: [{ translateY: sectionTranslate }]
          }
        ]}
      >
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionTitleLine} />
        </View>
        <View style={styles.sectionContent}>
          {children}
        </View>
      </Animated.View>
    );
  };

  // Field component
  const ProfileField = ({ label, value }) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || 'Not specified'}</Text>
    </View>
  );
  
  // Tab content for profile info
  const renderProfileInfo = () => (
    <Animated.View style={{ opacity: contentFade }}>
      <ProfileSection title="Personal Information" delay={0}>
        <ProfileField label="Full Name" value={user.fullName} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Phone" value={user.phone} />
        <ProfileField label="Location" value={user.location} />
      </ProfileSection>
      
      <ProfileSection title="Work Information" delay={100}>
        <ProfileField label="Job Title" value={user.jobTitle} />
        <ProfileField label="Department" value={user.department} />
        <ProfileField label="Company" value={user.company} />
      </ProfileSection>
      
      <ProfileSection title="Account Information" delay={200}>
        <ProfileField label="Member Since" value={user.memberSince} />
        <ProfileField label="Last Login" value={user.lastLogin} />
        <ProfileField label="Subscription Plan" value={user.plan} />
      </ProfileSection>
      
      <ProfileSection title="About" delay={300}>
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{user.bio || 'No bio available'}</Text>
        </View>
      </ProfileSection>
    </Animated.View>
  );
  
  // Tab content for security settings
  const renderSecuritySettings = () => (
    <Animated.View style={{ opacity: contentFade }}>
      <ProfileSection title="Password Management" delay={0}>
        <View style={styles.securityInfo}>
          <Text style={styles.securityInfoText}>Password last changed: <Text style={styles.securityHighlight}>3 months ago</Text></Text>
          <Text style={styles.securityInfoHint}>We recommend changing your password regularly for increased security.</Text>
        </View>
        <TouchableOpacity 
          style={styles.securityButton}
          activeOpacity={0.8}
          onPress={() => Haptics.selectionAsync()}
        >
          <LinearGradient
            colors={['#4f46e5', '#818cf8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.securityButtonGradient}
          >
            <Ionicons name="key-outline" size={18} color="#ffffff" />
            <Text style={styles.securityButtonText}>Change Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ProfileSection>
      
      <ProfileSection title="Two-Factor Authentication" delay={100}>
        <View style={styles.securityInfo}>
          <Text style={styles.securityInfoText}>Status: <Text style={{ color: '#f97316' }}>Not Enabled</Text></Text>
          <Text style={styles.securityInfoHint}>Add an extra layer of security to your account with two-factor authentication.</Text>
        </View>
        <TouchableOpacity 
          style={styles.securityButton}
          activeOpacity={0.8}
          onPress={() => Haptics.selectionAsync()}
        >
          <LinearGradient
            colors={['#4f46e5', '#818cf8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.securityButtonGradient}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#ffffff" />
            <Text style={styles.securityButtonText}>Enable 2FA</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ProfileSection>
      
      <ProfileSection title="Login History" delay={200}>
        <View style={styles.loginHistoryItem}>
          <View style={styles.loginHistoryLeft}>
            <Ionicons name="phone-portrait-outline" size={20} color="#6b7280" />
            <View style={styles.loginHistoryInfo}>
              <Text style={styles.loginHistoryTime}>Today at 9:30 AM</Text>
              <Text style={styles.loginHistoryDevice}>San Francisco, CA • Chrome on Windows</Text>
            </View>
          </View>
          <View style={styles.currentSessionBadge}>
            <Text style={styles.currentSessionText}>Current</Text>
          </View>
        </View>
        
        <View style={styles.loginHistoryItem}>
          <View style={styles.loginHistoryLeft}>
            <Ionicons name="laptop-outline" size={20} color="#6b7280" />
            <View style={styles.loginHistoryInfo}>
              <Text style={styles.loginHistoryTime}>Yesterday at 2:15 PM</Text>
              <Text style={styles.loginHistoryDevice}>San Francisco, CA • Safari on macOS</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.loginHistoryItem}>
          <View style={styles.loginHistoryLeft}>
            <Ionicons name="desktop-outline" size={20} color="#6b7280" />
            <View style={styles.loginHistoryInfo}>
              <Text style={styles.loginHistoryTime}>April 26, 2025 at 11:42 AM</Text>
              <Text style={styles.loginHistoryDevice}>San Francisco, CA • Chrome on Windows</Text>
            </View>
          </View>
        </View>
      </ProfileSection>
    </Animated.View>
  );
  
  // Tab content for preferences
  const renderPreferences = () => (
    <Animated.View style={{ opacity: contentFade }}>
      <ProfileSection title="Email Notifications" delay={0}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceIconContainer}>
            <Ionicons name="document-text-outline" size={20} color="#6b7280" />
          </View>
          <View style={styles.preferenceContent}>
            <View>
              <Text style={styles.preferenceLabel}>Document updates</Text>
              <Text style={styles.preferenceDescription}>Get notified when a document is updated or a new version is available.</Text>
            </View>
            <Switch
              value={preferences.documentUpdates}
              onValueChange={() => togglePreference('documentUpdates')}
              trackColor={{ false: '#d1d5db', true: '#c7d2fe' }}
              thumbColor={preferences.documentUpdates ? '#4f46e5' : '#f9fafb'}
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceIconContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
          </View>
          <View style={styles.preferenceContent}>
            <View>
              <Text style={styles.preferenceLabel}>Security alerts</Text>
              <Text style={styles.preferenceDescription}>Receive alerts about security issues and login attempts.</Text>
            </View>
            <Switch
              value={preferences.securityAlerts}
              onValueChange={() => togglePreference('securityAlerts')}
              trackColor={{ false: '#d1d5db', true: '#c7d2fe' }}
              thumbColor={preferences.securityAlerts ? '#4f46e5' : '#f9fafb'}
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceIconContainer}>
            <Ionicons name="mail-outline" size={20} color="#6b7280" />
          </View>
          <View style={styles.preferenceContent}>
            <View>
              <Text style={styles.preferenceLabel}>Marketing emails</Text>
              <Text style={styles.preferenceDescription}>Get notified about new features and special offers.</Text>
            </View>
            <Switch
              value={preferences.marketingEmails}
              onValueChange={() => togglePreference('marketingEmails')}
              trackColor={{ false: '#d1d5db', true: '#c7d2fe' }}
              thumbColor={preferences.marketingEmails ? '#4f46e5' : '#f9fafb'}
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>
      </ProfileSection>
      
      <ProfileSection title="Appearance" delay={100}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceIconContainer}>
            <Ionicons name="moon-outline" size={20} color="#6b7280" />
          </View>
          <View style={styles.preferenceContent}>
            <View>
              <Text style={styles.preferenceLabel}>Dark Mode</Text>
              <Text style={styles.preferenceDescription}>Use dark theme for the application.</Text>
            </View>
            <Switch
              value={preferences.darkMode}
              onValueChange={() => togglePreference('darkMode')}
              trackColor={{ false: '#d1d5db', true: '#c7d2fe' }}
              thumbColor={preferences.darkMode ? '#4f46e5' : '#f9fafb'}
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>
      </ProfileSection>
      
      <ProfileSection title="Language" delay={200}>
        <TouchableOpacity 
          style={styles.languageButton}
          activeOpacity={0.7}
          onPress={() => Haptics.selectionAsync()}
        >
          <View style={styles.languageButtonContent}>
            <Ionicons name="language-outline" size={20} color="#4f46e5" />
            <Text style={styles.languageButtonText}>English (US)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </ProfileSection>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Header - Fixed height with translateY for animation */}
      <Animated.View 
        style={[
          styles.header,
          { 
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <LinearGradient
          colors={['#f9fafb', '#ffffff']}
          style={styles.headerGradient}
        />
        <Animated.View 
          style={[
            styles.headerContent,
            {
              opacity: headerOpacity
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.avatarContainer,
              {
                transform: [
                  { scale: avatarScale },
                  { translateY: avatarTranslateY },
                  { translateX: avatarTranslateX }
                ]
              }
            ]}
          >
            {user.profilePicture ? (
              <Image 
                source={{ uri: user.profilePicture }} 
                style={styles.avatar}
              />
            ) : (
              <LinearGradient
                colors={['#4f46e5', '#818cf8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              </LinearGradient>
            )}
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                { translateY: nameTranslateY },
                { translateX: nameTranslateX },
                { scale: nameScale }
              ]
            }}
          >
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{user.plan} Plan</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
      
      {/* Tab Navigation */}
      <Animated.View 
        style={[
          styles.tabBarContainer,
          {
            transform: [{ translateY: tabBarTranslateY }],
            opacity: tabFade
          }
        ]}
      >
        <BlurView
          intensity={80}
          tint="light"
          style={styles.tabBarBlur}
        />
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]} 
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('profile');
            }}
          >
            <Ionicons 
              name={activeTab === 'profile' ? "person" : "person-outline"} 
              size={20} 
              color={activeTab === 'profile' ? '#4f46e5' : '#6b7280'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'profile' && styles.activeTabText
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'security' && styles.activeTabItem]} 
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('security');
            }}
          >
            <Ionicons 
              name={activeTab === 'security' ? "shield" : "shield-outline"} 
              size={20} 
              color={activeTab === 'security' ? '#4f46e5' : '#6b7280'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'security' && styles.activeTabText
              ]}
            >
              Security
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'preferences' && styles.activeTabItem]} 
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('preferences');
            }}
          >
            <Ionicons 
              name={activeTab === 'preferences' ? "settings" : "settings-outline"} 
              size={20} 
              color={activeTab === 'preferences' ? '#4f46e5' : '#6b7280'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'preferences' && styles.activeTabText
              ]}
            >
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Tab Content */}
      <Animated.ScrollView 
        contentContainerStyle={[
          styles.content,
          { paddingTop: HEADER_HEIGHT + 60 }
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // Changed to true since we're only using supported properties
        )}
      >
        {activeTab === 'profile' && renderProfileInfo()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'preferences' && renderPreferences()}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#4b5563" style={styles.buttonIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color="#b91c1c" style={styles.buttonIcon} />
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  loadingLogoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
    height: HEADER_HEIGHT, // Fixed height instead of animated
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 0
  },
  avatarContainer: {
    marginBottom: 10
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ffffff'
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff'
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 6
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2
  },
  planBadge: {
    backgroundColor: '#eff6ff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'center'
  },
  planText: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 12
  },
  tabBarContainer: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
  },
  tabBarBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)'
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 4
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 4
  },
  activeTabText: {
    color: '#4f46e5'
  },
  content: {
    padding: 16,
    paddingBottom: 32
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    padding: 16
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginRight: 12
  },
  sectionTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb'
  },
  sectionContent: {
    
  },
  field: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  fieldValue: {
    fontSize: 15,
    color: '#1f2937'
  },
  bioContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8
  },
  bioText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22
  },
  actionButtons: {
    marginTop: 16
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  logoutButtonText: {
    color: '#4b5563',
    fontWeight: '600',
    fontSize: 16
  },
  deleteAccountButton: {
    flexDirection: 'row',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteAccountButtonText: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 16
  },
  buttonIcon: {
    marginRight: 8
  },
  securityInfo: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8
  },
  securityInfoText: {
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 4
  },
  securityHighlight: {
    fontWeight: '600'
  },
  securityInfoHint: {
    fontSize: 13,
    color: '#6b7280'
  },
  securityButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4
  },
  securityButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  securityButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8
  },
  loginHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  loginHistoryLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  loginHistoryInfo: {
    marginLeft: 10,
    flex: 1
  },
  loginHistoryTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937'
  },
  loginHistoryDevice: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  currentSessionBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  currentSessionText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '500'
  },
  preferenceItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  preferenceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  preferenceContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#6b7280',
    width: '90%'
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  languageButtonText: {
    fontSize: 15,
    color: '#1f2937',
    marginLeft: 8,
    fontWeight: '500'
  }
});

export default ProfileScreen;