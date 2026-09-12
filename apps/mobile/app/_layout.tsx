import { Stack } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(consumer)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f3f4f6' : 'white', // Grey background on web desktop
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 500 : '100%', // 500px looks like a phone (10:16 aspect)
    alignSelf: 'center',
    backgroundColor: 'white',
    boxShadow: Platform.OS === 'web' ? '0px 0px 20px rgba(0,0,0,0.1)' : undefined,
    elevation: 0,
    overflow: 'hidden'
  }
});

