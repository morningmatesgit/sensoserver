import { Redirect } from 'expo-router';
import { useAuth } from '../context/AppContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { isLoading } = useAuth();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5a3d" />
      </View>
    );
  }

  // Always start at dashboard as requested
  // if (!isAuthenticated) {
  //   return <Redirect href="/dashboard/welcome" />;
  // }

  return <Redirect href="/dashboard/dashboard" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f0',
  },
});
