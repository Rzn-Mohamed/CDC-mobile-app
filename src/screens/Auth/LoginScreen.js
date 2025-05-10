import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Dimensions,
  Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../../App';
import { mockAuthResponse } from '../../utils/dummyData';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const animatedOpacity = new Animated.Value(0);
  const animatedTranslateY = new Animated.Value(30);
  const animatedLogoSize = new Animated.Value(1);
  
  const { signIn } = useAuth();
  
  useEffect(() => {
    // Animation when component mounts
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(animatedTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
    
    // Keyboard listeners for animation
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(animatedLogoSize, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(animatedLogoSize, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  
  const handleLogin = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, you would validate credentials with a backend API
      // This is just a simulation for the mockup
      if (email.toLowerCase() === 'razin@example.com' && password === 'password123') {
        // Wait for sign in to complete before changing loading state
        await signIn(mockAuthResponse);
      } else {
        Alert.alert('Error', 'Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.headerContainer,
            { 
              opacity: animatedOpacity,
              transform: [
                { translateY: animatedTranslateY },
                { scale: animatedLogoSize }
              ]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#4f46e5', '#818cf8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logo}
            >
              <Text style={styles.logoText}>CDC</Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Enter your credentials to access your account</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.formContainer,
            { 
              opacity: animatedOpacity,
              transform: [{ translateY: animatedTranslateY }]
            }
          ]}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="razin@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureTextEntry}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={toggleSecureEntry}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={{
                  transform: [{
                    rotate: new Animated.Value(0).interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }]
                }}>
                  <Ionicons name="reload-outline" size={22} color="#ffffff" />
                </Animated.View>
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Signing In...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.buttonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
        
        <View style={[
          styles.footerContainer, 
          keyboardVisible && styles.footerContainerKeyboardVisible
        ]}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center'
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: '80%'
  },
  formContainer: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    position: 'relative'
  },
  inputIcon: {
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    height: '100%'
  },
  eyeIcon: {
    padding: 8
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonIcon: {
    position: 'absolute',
    right: 20
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  footerContainerKeyboardVisible: {
    marginTop: 12
  },
  footerText: {
    fontSize: 15,
    color: '#6b7280'
  },
  footerLink: {
    fontSize: 15,
    color: '#4f46e5',
    fontWeight: '600'
  }
});

export default LoginScreen;