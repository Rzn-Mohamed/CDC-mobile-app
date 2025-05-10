import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  Dimensions,
  StatusBar as RNStatusBar,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { documentsData } from '../../utils/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Document Card Component
const DocumentCard = ({ document, onPress, index, scrollY }) => {
  // Scale animation for cards when scrolling
  const inputRange = [-1, 0, 175 * index, 175 * (index + 1)];
  
  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.9],
    extrapolate: 'clamp',
  });
  
  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0.8],
    extrapolate: 'clamp',
  });
  
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
  
  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale }],
          opacity
        }
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(document)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.typeIndicatorContainer]}>
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.typeIndicator}
              >
                <Ionicons name={getDocumentIcon(document.type)} size={16} color={text} />
                <Text style={[styles.typeText, { color: text }]}>
                  {document.type.toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.versionContainer}>
              <Text style={styles.versionTag}>{document.version}</Text>
            </View>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>
            {document.title}
          </Text>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {document.description}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text style={styles.timeText}>{document.lastModified}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SearchBar = ({ value, onChangeText, scrollY }) => {
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 120],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={styles.searchBarWrapper}>
      <AnimatedBlurView
        intensity={30}
        tint="light"
        style={[
          styles.blurContainer,
          { opacity: headerOpacity }
        ]}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChangeText}
          />
          {value.trim() !== '' && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#4f46e5" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const DashboardScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState(documentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  
  // Filter documents based on search query
  const filteredDocuments = searchQuery.trim() === '' 
    ? documents 
    : documents.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  // Handle document selection
  const handleDocumentPress = (document) => {
    navigation.navigate('DocumentDetail', { document });
  };
  
  // Mock refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Ionicons name="document" size={60} color="#d1d5db" />
      </View>
      <Text style={styles.emptyStateTitle}>No documents found</Text>
      <Text style={styles.emptyStateDescription}>
        {searchQuery.trim() !== '' 
          ? "Try adjusting your search terms" 
          : "No documents available"}
      </Text>
    </View>
  );

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [120, 70],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });
  
  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0.8, 0.9, 1],
    extrapolate: 'clamp',
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Animated Header */}
      <Animated.View style={[
        styles.header,
        { height: headerHeight }
      ]}>
        <AnimatedBlurView
          intensity={20}
          tint="light"
          style={[
            styles.headerBlur,
            { opacity: headerTitleOpacity }
          ]}
        />
        <View style={styles.headerContent}>
          <Animated.Text 
            style={[
              styles.headerTitle,
              { 
                opacity: headerTitleOpacity,
                transform: [{ scale: headerTitleScale }]
              }
            ]}
          >
            CDC Manager
          </Animated.Text>
        </View>
      </Animated.View>
      
      {/* Search Bar */}
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        scrollY={scrollY}
      />
      
      {/* Document List */}
      <View style={styles.listContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Documents</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {filteredDocuments.length === 0 ? (
          renderEmptyState()
        ) : (
          <Animated.FlatList
            data={filteredDocuments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <DocumentCard 
                document={item} 
                onPress={handleDocumentPress} 
                index={index}
                scrollY={scrollY}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
      
      {/* FAB removed */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchBarWrapper: {
    position: 'absolute',
    top: Platform.OS === 'android' ? RNStatusBar.currentHeight + 70 : 70,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1f2937',
  },
  clearButton: {
    padding: 6,
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  listContainer: {
    flex: 1,
    paddingTop: 130,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  viewAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicatorContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  versionContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  versionTag: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Changed from space-between
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 40,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  }
  // Removed FAB styles
});

export default DashboardScreen;