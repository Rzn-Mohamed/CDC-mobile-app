import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import screens
import LoginScreen from './src/screens/Auth/LoginScreen';
import SignupScreen from './src/screens/Auth/SignupScreen';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';
import DocumentDetailScreen from './src/screens/Dashboard/DocumentDetailScreen';

// Define theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4f46e5',
    secondary: '#818cf8',
    background: '#ffffff',
    card: '#ffffff',
    text: '#1f2937',
    border: '#e5e7eb',
    notification: '#ef4444',
    accent: '#3b82f6',
  },
};

// Create navigation stacks
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Create authentication context
const AuthContext = createContext();

// Auth provider component
export function useAuth() {
  return useContext(AuthContext);
}

// Main tab navigator for authenticated users
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: MyTheme.colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'Documents'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
  });
  
  // Authentication functions
  const authContext = React.useMemo(() => ({
    signIn: async (data) => {
      // In a real app, send data to your backend
      // This is for demo purposes only - API call would go here
      // const response = await fetch('YOUR_API_URL/login', {...});
      
      // Store token securely
      try {
        // Mock token for demo
        const token = data?.token || 'mock-auth-token';
        await SecureStore.setItemAsync('userToken', token);
        // Use function update to ensure we get the latest state
        setState(prevState => ({ 
          ...prevState, 
          isSignout: false, 
          userToken: token 
        }));
      } catch (e) {
        console.error('Error signing in:', e);
      }
    },
    signOut: async () => {
      // Clear token from secure storage
      try {
        await SecureStore.deleteItemAsync('userToken');
        // Use function update to ensure we get the latest state
        setState(prevState => ({ 
          ...prevState, 
          isSignout: true, 
          userToken: null 
        }));
      } catch (e) {
        console.error('Error signing out:', e);
      }
    },
    signUp: async (data) => {
      // In a real app, send data to your backend
      // This is for demo purposes only - API call would go here
      // const response = await fetch('YOUR_API_URL/register', {...});
      
      // Store token securely
      try {
        // Mock token for demo
        const token = 'mock-auth-token';
        await SecureStore.setItemAsync('userToken', token);
        // Use function update to ensure we get the latest state
        setState(prevState => ({ 
          ...prevState, 
          isSignout: false, 
          userToken: token 
        }));
      } catch (e) {
        console.error('Error signing up:', e);
      }
    }
  }), []);
  
  // Check if user is logged in
  useEffect(() => {
    // Fetch the token from storage
    const bootstrapAsync = async () => {
      let userToken;
      
      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('Failed to get token from storage:', e);
      }
      
      // Update state with user token
      setState(prevState => ({ 
        ...prevState, 
        isLoading: false, 
        userToken 
      }));
    };
    
    bootstrapAsync();
  }, []);
  
  // Show loading indicator while checking authentication
  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color={MyTheme.colors.primary} />
      </View>
    );
  }
  
  // Render application
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleStyle: {
              fontWeight: '600',
            },
            contentStyle: {
              backgroundColor: '#ffffff',
            },
            animation: 'slide_from_right',
          }}
        >
          {state.userToken == null ? (
            // Auth screens
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ 
                  title: 'Sign in',
                  headerShown: false,
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
              <Stack.Screen 
                name="Signup" 
                component={SignupScreen}
                options={{ 
                  title: 'Create Account',
                  headerShown: false,
                }}
              />
            </>
          ) : (
            // App screens
            <>
              <Stack.Screen 
                name="Main" 
                component={MainTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="DocumentDetail" 
                component={DocumentDetailScreen}
                options={{ 
                  title: 'Document Details',
                  headerBackTitle: 'Back',
                  headerTitleAlign: 'center',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
