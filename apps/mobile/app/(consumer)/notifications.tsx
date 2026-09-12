import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const DEMO_NOTIFICATIONS = [
  { id: '1', title: 'Welcome to Herodoto!', message: 'Start exploring guides near you.' },
  { id: '2', title: 'You leveled up!', message: 'You reached Level 3.' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={DEMO_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  message: { fontSize: 14, color: '#666', marginTop: 4 }
});
