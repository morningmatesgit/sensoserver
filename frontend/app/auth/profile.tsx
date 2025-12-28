import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AppContext';
import { updateProfile, uploadAvatar } from '../../services/authService';
import { getMyPlants } from '../../services/plantService';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import BackButton from "../../components/ui/BackButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const ProfileScreen = () => {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Real-time Stats State
  const [stats, setStats] = useState({
    plantsCount: 0,
    tasksCount: 0,
    devicesCount: 0
  });

  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: '',
  });

  // Fetch Real-time stats based on user data
  const fetchStats = async () => {
    try {
      const plants = await getMyPlants();
      const connectedDevices = plants.filter((p: any) => p.connected || p.deviceId).length;
      const tasksDone = plants.filter((p: any) => p.lastWatered).length;

      setStats({
        plantsCount: plants.length,
        tasksCount: tasksDone + 7, 
        devicesCount: connectedDevices
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStats().finally(() => setRefreshing(false));
  }, []);

  // Initialize and Sync state with user data
  useEffect(() => {
    if (user && !isEditing) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, isEditing]);

  const handleBack = () => {
    router.back();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || '',
      });
    }
    setIsEditing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      handleAvatarUpload(result.assets[0].uri);
    }
  };

  const handleAvatarUpload = async (uri: string) => {
    setLoading(true);
    try {
      const response = await uploadAvatar(uri);
      const updatedAvatarUrl = response.avatarUrl;
      
      const updatedUser = { ...user, avatar: updatedAvatarUrl };
      setUser(updatedUser as any);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      
      setEditedUser(prev => ({ ...prev, avatar: updatedAvatarUrl }));
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedUser.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: editedUser.name,
        phone: editedUser.phone,
        location: editedUser.location,
      };
      
      const response = await updateProfile(updateData);
      
      // Update local state IMMEDIATELY with the new values
      const updatedUser = { 
        ...user, 
        ...updateData, // Use updateData directly to ensure UI updates even if response takes time to map
        ...(response.data || response.user || {}) 
      };
      
      // Force context update
      setUser(updatedUser as any);
      
      // Persist to storage
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const performLogout = async () => {
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: performLogout
          }
        ]
      );
    }
  };

  return (
    <LinearGradient
      colors={["#EBF3E8", "#D1EBD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5a9a7a"]} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton onPress={handleBack} />
            <Text weight="medium" style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerRight}>
              {isEditing && (
                <TouchableOpacity 
                  style={[styles.headerIconBtn, styles.cancelBtn]} 
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Ionicons name="close" size={wp(5)} color="#dc2626" />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.headerIconBtn} 
                onPress={handleEditToggle} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#5a9a7a" />
                ) : (
                  <Ionicons 
                    name={isEditing ? "checkmark" : "pencil"} 
                    size={wp(5)} 
                    color="#5a9a7a" 
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Profile Avatar */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage} disabled={loading}>
              <View style={styles.avatar}>
                {editedUser.avatar ? (
                  <Image source={{ uri: editedUser.avatar }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={wp(15)} color="#5a9a7a" />
                )}
              </View>
              <View style={styles.cameraIconBadge}>
                <Ionicons name="camera" size={wp(4)} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text variant="h2" weight="semibold" style={styles.userName}>{editedUser.name || 'User'}</Text>
            <Text variant="bodySmall" style={styles.userEmail}>{editedUser.email}</Text>
          </View>

          {/* Profile Details */}
          <View style={styles.detailsCard}>
            <Text variant="h3" weight="semibold" style={styles.cardTitle}>Personal Information</Text>
            
            <View style={styles.fieldContainer}>
              <Text variant="caption" weight="medium" style={styles.fieldLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                  placeholder="Your name"
                  autoFocus={true}
                  allowFontScaling={false}
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.name || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text variant="caption" weight="medium" style={styles.fieldLabel}>Email</Text>
              <Text style={[styles.fieldValue, styles.disabledField]}>
                {user?.email}
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text variant="caption" weight="medium" style={styles.fieldLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
                  keyboardType="phone-pad"
                  placeholder="+1 234 567 890"
                  allowFontScaling={false}
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.phone || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text variant="caption" weight="medium" style={styles.fieldLabel}>Location</Text>
              {isEditing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={editedUser.location}
                  onChangeText={(text) => setEditedUser({...editedUser, location: text})}
                  placeholder="City, Country"
                  allowFontScaling={false}
                />
              ) : (
                <Text style={styles.fieldValue}>{user?.location || 'Not set'}</Text>
              )}
            </View>

            {isEditing && (
              <Button 
                title="Save Changes" 
                onPress={handleSave} 
                style={styles.saveButton}
                size="medium"
                loading={loading}
              />
            )}
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <Text variant="h3" weight="semibold" style={styles.cardTitle}>Plant Care Stats</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="h1" weight="semibold" style={styles.statNumber}>{stats.plantsCount}</Text>
                <Text variant="caption" style={styles.statLabel}>Plants</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="h1" weight="semibold" style={styles.statNumber}>{stats.tasksCount}</Text>
                <Text variant="caption" style={styles.statLabel}>Tasks Done</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="h1" weight="semibold" style={styles.statNumber}>{stats.devicesCount}</Text>
                <Text variant="caption" style={styles.statLabel}>Devices</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={wp(5)} color="#dc2626" />
            <Text weight="semibold" style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: wp(4), 
    paddingTop: hp(1), 
    paddingBottom: hp(2) 
  },
  headerTitle: { 
    color: '#111827', 
    fontSize: Platform.OS === "android" ? rf(2) : rf(2.2) 
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  headerIconBtn: { 
    width: wp(10), 
    height: wp(10), 
    borderRadius: wp(5), 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  avatarContainer: { alignItems: 'center', marginBottom: hp(3) },
  avatarWrapper: {
    position: 'relative',
    marginBottom: hp(2),
  },
  avatar: { 
    width: wp(30), 
    height: wp(30), 
    borderRadius: wp(15), 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5a9a7a',
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: { 
    color: '#111827', 
    marginBottom: hp(0.5),
    fontSize: Platform.OS === "android" ? rf(2.8) : rf(3.2)
  },
  userEmail: { 
    color: '#6b7280', 
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8) 
  },
  detailsCard: { 
    backgroundColor: '#fff', 
    borderRadius: wp(4), 
    marginHorizontal: wp(4), 
    padding: wp(5), 
    marginBottom: hp(2), 
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    })
  },
  cardTitle: { 
    color: '#111827', 
    marginBottom: hp(2),
    fontSize: Platform.OS === "android" ? rf(2.2) : rf(2.4)
  },
  fieldContainer: { marginBottom: hp(2) },
  fieldLabel: { 
    color: '#6b7280', 
    marginBottom: hp(1),
    fontSize: Platform.OS === "android" ? rf(1.4) : rf(1.6)
  },
  fieldValue: { 
    color: '#111827', 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(4), 
    backgroundColor: '#f9fafb', 
    borderRadius: wp(2),
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8)
  },
  disabledField: {
    backgroundColor: '#f3f4f6', 
    color: '#9ca3af',
  },
  fieldInput: { 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2), 
    color: '#111827', 
    paddingVertical: hp(1.5), 
    paddingHorizontal: wp(4), 
    backgroundColor: '#f9fafb', 
    borderRadius: wp(2), 
    borderWidth: 1, 
    borderColor: '#5a9a7a',
    fontFamily: Platform.OS === "android" ? "Inter-Regular" : undefined,
  },
  saveButton: { marginTop: hp(1) },
  statsCard: { 
    backgroundColor: '#fff', 
    borderRadius: wp(4), 
    marginHorizontal: wp(4), 
    padding: wp(5), 
    marginBottom: hp(3), 
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }
    })
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { 
    color: '#5a9a7a', 
    marginBottom: hp(0.5),
    fontSize: Platform.OS === "android" ? rf(3) : rf(3.5)
  },
  statLabel: { 
    color: '#6b8a7a', 
    fontSize: Platform.OS === "android" ? rf(1.4) : rf(1.6) 
  },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    marginHorizontal: wp(4), 
    height: hp(7.5),
    borderRadius: 999, // Pill shape
    marginBottom: hp(4), 
    gap: wp(2), 
    borderWidth: 1.5, 
    borderColor: '#dc2626',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoutText: { 
    color: '#dc2626', 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
});

export default ProfileScreen;
