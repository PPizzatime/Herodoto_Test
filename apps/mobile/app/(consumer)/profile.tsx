import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [points, setPoints] = useState(350);
  const [level, setLevel] = useState(3);
  const [email, setEmail] = useState('Not signed in');
  const [loading, setLoading] = useState(true);
  const pointsForNextLevel = 500;
  
  const progress = points / pointsForNextLevel;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
      } else {
        // Fallback for when the DB is offline and we bypassed auth
        setEmail('consumer@test.com (Bypassed)');
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Gamification</Text>
        <Text style={styles.stat}>Level {level}</Text>
        <Text style={styles.stat}>{points} / {pointsForNextLevel} Points</Text>
        <View style={styles.progressBar}>
           {/* Fallback to simple view width for cross-platform progress bar */}
           <View style={{ width: '100%', height: 10, backgroundColor: '#eee', borderRadius: 5 }}>
             <View style={{ width: `${progress * 100}%`, height: 10, backgroundColor: 'tomato', borderRadius: 5 }} />
           </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <Text style={styles.stat}>Status: FREE</Text>
        <Button title="Upgrade Plan" onPress={() => alert('Upgrade flow')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    elevation: 2
  },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#666', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  stat: { fontSize: 16, marginBottom: 8 },
  progressBar: { marginTop: 8 },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

