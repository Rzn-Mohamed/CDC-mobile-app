import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Animated,
  Dimensions,
  Share,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const ANIMATION_DURATION = 300;

const DocumentDetailScreen = ({ route, navigation }) => {
  const { document } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(document.title);
  const [documentDescription, setDocumentDescription] = useState(document.description);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Animation values
  const headerHeight = useRef(new Animated.Value(200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Function to determine color based on document type
  const getTypeColor = (type) => {
    const colors = {
      pdf: {
        bg: '#fee2e2',
        text: '#ef4444',
        gradient: ['#fecaca', '#fee2e2']
      },
      doc: {
        bg: '#e0e7ff',
        text: '#4f46e5',
        gradient: ['#c7d2fe', '#e0e7ff']
      }
    };
    
    return colors[type] || colors.doc;
  };
  
  const { bg, text, gradient } = getTypeColor(document.type);
  
  // Get document type icon
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'doc':
        return 'document-text';
      default:
        return 'document';
    }
  };
  
  // Save document changes
  const handleSaveChanges = () => {
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // In a real app, you would make an API call to update the document
    // For this mockup, we'll just simulate the change
    Alert.alert(
      "Success",
      "Document updated successfully",
      [{ text: "OK", onPress: () => setIsEditing(false) }]
    );
    
    // Update document title in navigation header
    navigation.setOptions({ title: documentTitle });
  };
  
  // Handle document deletion
  const handleDelete = () => {
    // Show confirmation dialog
    if (!isDeleting) {
      setIsDeleting(true);
      Alert.alert(
        "Delete Document",
        "Are you sure you want to delete this document? This action cannot be undone.",
        [
          { text: "Cancel", onPress: () => setIsDeleting(false), style: "cancel" },
          { 
            text: "Delete", 
            onPress: () => {
              // Provide haptic feedback
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              
              // In a real app, you would make an API call to delete the document
              // For this mockup, we'll just navigate back with a fade animation
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: ANIMATION_DURATION,
                  useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                  toValue: 0.9,
                  duration: ANIMATION_DURATION,
                  useNativeDriver: true,
                }),
              ]).start(() => {
                Alert.alert(
                  "Success",
                  "Document deleted successfully",
                  [{ text: "OK", onPress: () => navigation.goBack() }]
                );
              });
            },
            style: "destructive" 
          }
        ]
      );
    }
  };
  
  // Handle document sharing
  const handleShare = async () => {
    try {
      // Provide haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const result = await Share.share({
        title: documentTitle,
        message: `Check out this document: ${documentTitle}\n\n${documentDescription}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share document');
    }
  };
  
  // Handle document download
  const handleDownload = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // In a real app, you would implement download functionality
    Alert.alert('Download Started', 'Your document download has begun');
  };
  
  // Set options in navigation header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <View style={styles.headerButtons}>
          {isEditing ? (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                // Provide haptic feedback
                Haptics.selectionAsync();
                setIsEditing(true);
              }}
            >
              <Ionicons name="pencil" size={22} color="#4f46e5" />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerTransparent: true,
      headerTintColor: '#4f46e5',
      headerShadowVisible: false,
    });
  }, [navigation, document.title, isEditing, documentTitle]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View 
        style={[
          styles.animated,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Header Background */}
        <View style={styles.headerBackground}>
          <LinearGradient
            colors={['#f9fafb', '#ffffff']}
            style={styles.headerGradient}
          />
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Document Type and Version */}
          <View style={styles.documentTypeContainer}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.typeIndicator}
            >
              <Ionicons name={getDocumentIcon(document.type)} size={24} color={text} />
              <Text style={[styles.typeText, { color: text }]}>
                {document.type.toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>{document.version}</Text>
            </View>
          </View>
          
          {/* Document Title */}
          <View style={styles.titleContainer}>
            {isEditing ? (
              <TextInput
                style={styles.titleInput}
                value={documentTitle}
                onChangeText={setDocumentTitle}
                autoFocus
                multiline
                maxLength={100}
                selectionColor="#4f46e5"
              />
            ) : (
              <Text style={styles.titleText}>{document.title}</Text>
            )}
          </View>
          
          {/* Document Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={20} color="#6b7280" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Modified</Text>
                <Text style={styles.infoValue}>{document.lastModified}</Text>
              </View>
            </View>
          </View>
          
          {/* Document Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            {isEditing ? (
              <TextInput
                style={styles.descriptionInput}
                value={documentDescription}
                onChangeText={setDocumentDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                selectionColor="#4f46e5"
              />
            ) : (
              <Text style={styles.descriptionText}>
                {document.description || "No description available."}
              </Text>
            )}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadButton]}
              onPress={handleDownload}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4f46e5', '#4338ca']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="cloud-download-outline" size={20} color="#ffffff" />
                <Text style={styles.actionButtonText}>Download</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonInner}>
                <Ionicons name="share-outline" size={20} color="#4b5563" />
                <Text style={styles.actionButtonTextAlt}>Share</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Delete Button */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color="#b91c1c" />
            <Text style={styles.deleteButtonText}>Delete Document</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  animated: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 140,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 80 : 30,
  },
  documentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  versionContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  titleContainer: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    lineHeight: 34,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
  },
  descriptionContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  descriptionInput: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 120,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
    height: 48,
  },
  downloadButton: {
    elevation: 2,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 16,
  },
  actionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  actionButtonTextAlt: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#b91c1c',
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#4f46e5',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default DocumentDetailScreen;