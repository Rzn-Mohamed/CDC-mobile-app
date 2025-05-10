import React, { useState, useEffect, useRef } from 'react';
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
  Keyboard,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../../App';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  
  const { signUp } = useAuth();
  
  useEffect(() => {
    // Fade in animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
    
    // Keyboard listeners for animation
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(logoScale, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(logoScale, {
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
  
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password) => {
    // Password should be at least 6 characters with at least 1 number
    return password.length >= 6 && /\d/.test(password);
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    
    // Validate full name
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters with 1 number';
      isValid = false;
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  const handleSignup = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();
    
    if (!validateForm()) {
      // Provide error feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Provide success feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // In a real app, you would register with a backend API
      // This is just a simulation for the mockup
      await signUp({
        email: formData.email,
        fullName: formData.fullName
      });
      // No need to reset loading state as the component will unmount when auth state changes
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register. Please try again.');
      setIsLoading(false);
      
      // Provide error feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  
  // Input field component for consistent styling
  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    iconName, 
    keyboardType = 'default',
    secureTextEntry = false,
    placeholder,
    error,
    toggleSecure = null,
    isSecure = false,
    autoCapitalize = 'none',
    returnKeyType = 'next'
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}>
        <Ionicons name={iconName} size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
        />
        {toggleSecure && (
          <TouchableOpacity 
            onPress={toggleSecure}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={isSecure ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.headerContainer,
            { 
              opacity: fadeAnim,
              transform: [
                { translateY },
                { scale: logoScale }
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
          <Text style={styles.headerTitle}>Create an account</Text>
          <Text style={styles.headerSubtitle}>Sign up to get started with our services</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.formContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY }]
            }
          ]}
        >
          <InputField
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            iconName="person-outline"
            placeholder="Razin Mohamed"
            error={validationErrors.fullName}
            autoCapitalize="words"
          />
          
          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            iconName="mail-outline"
            keyboardType="email-address"
            placeholder="razin@example.com"
            error={validationErrors.email}
          />
          
          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            iconName="lock-closed-outline"
            secureTextEntry={securePassword}
            placeholder="••••••••"
            error={validationErrors.password}
            toggleSecure={() => setSecurePassword(!securePassword)}
            isSecure={securePassword}
          />
          
          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            iconName="shield-checkmark-outline"
            secureTextEntry={secureConfirmPassword}
            placeholder="••••••••"
            error={validationErrors.confirmPassword}
            toggleSecure={() => setSecureConfirmPassword(!secureConfirmPassword)}
            isSecure={secureConfirmPassword}
            returnKeyType="done"
          />
          
          <TouchableOpacity 
            style={[
              styles.button,
              isLoading && styles.buttonDisabled
            ]}
            onPress={handleSignup}
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
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>Creating Account...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.buttonText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </Animated.View>
        
        <View style={[
          styles.footerContainer, 
          keyboardVisible && styles.footerContainerKeyboardVisible
        ]}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Log in</Text>
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
    paddingTop: Platform.OS === 'android' ? 40 : 20
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  logoContainer: {
    marginBottom: 20,
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
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  headerTitle: {
    fontSize: 24,
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
    width: '100%',
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 16
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
  inputWrapperError: {
    borderColor: '#ef4444'
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
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
    marginTop: 8
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
  termsContainer: {
    marginTop: 16,
    alignItems: 'center'
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18
  },
  termsLink: {
    color: '#4f46e5',
    fontWeight: '500'
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  footerContainerKeyboardVisible: {
    marginTop: 8
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

export default SignupScreen;