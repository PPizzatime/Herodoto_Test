import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator, Platform, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [points, setPoints] = useState(350);
  const [level, setLevel] = useState(3);
  const [email, setEmail] = useState('Not signed in');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  
  const pointsForNextLevel = 500;
  const progress = points / pointsForNextLevel;

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data);
          setFirstName(data.first_name || '');
        }
        const { data: gamification } = await supabase.from('gamification_profiles').select('*').eq('user_id', user.id).single();
        if (gamification) {
          setPoints(gamification.points || 0);
          setLevel(gamification.level || 1);
        } else {
          setPoints(0);
          setLevel(1);
        }
      } else {
        setEmail('consumer@test.com (Bypassed)');
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ first_name: firstName }).eq('id', user.id);
      setProfile({ ...profile, first_name: firstName });
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.replace('/');
  };

  const handleEnterOffice = () => {
    const role = email.split('@')[0];
    const workerUrl = __DEV__ 
      ? 'http://localhost:3000/office/dashboard?role=' + role
      : '/office/dashboard?role=' + role;
    
    if (Platform.OS === 'web') {
      window.location.href = workerUrl;
    } else {
      alert('Please open the web portal on your desktop to access the Office!');
    }
  };

  const isWorker = email.endsWith('@herodoto.art');

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={{ width: 60, height: 60, borderRadius: 30, marginRight: 16 }} />
          ) : (
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd', marginRight: 16 }} />
          )}
          <View style={{ flex: 1 }}>
            {isEditing ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput 
                  value={firstName} 
                  onChangeText={setFirstName} 
                  style={{ borderBottomWidth: 1, borderColor: '#ccc', fontSize: 24, fontWeight: 'bold', flex: 1 }} 
                />
                <TouchableOpacity onPress={saveProfile} style={{ backgroundColor: 'black', padding: 8, borderRadius: 4, marginLeft: 8 }}>
                  <Text style={{ color: 'white' }}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.name}>{profile?.first_name || 'Guest User'} {profile?.last_name || ''}</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: 'blue' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>

      {isWorker && (
        <View style={[styles.card, { backgroundColor: '#111827' }]}>
          <Text style={[styles.sectionTitle, { color: 'white' }]}>Employee Portal</Text>
          <Text style={[styles.stat, { color: '#9ca3af', marginBottom: 16 }]}>Access CMS, tasks, and organization tools.</Text>
          <TouchableOpacity style={styles.officeButton} onPress={handleEnterOffice}>
            <Text style={styles.officeButtonText}>Enter Office Dashboard ??</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Gamification</Text>
        <Text style={styles.stat}>Level {level}</Text>
        <Text style={styles.stat}>{points} / {pointsForNextLevel} Points</Text>
        <View style={styles.progressBar}>
           <View style={{ width: '100%', height: 10, backgroundColor: '#eee', borderRadius: 5 }}>
             <View style={{ width: `${progress * 100}%`, height: 10, backgroundColor: 'tomato', borderRadius: 5 }} />
           </View>
        </View>
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
  officeButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  officeButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
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




