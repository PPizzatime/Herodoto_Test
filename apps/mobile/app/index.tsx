import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Briefcase, Shield, Settings } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(consumer)/guides');
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleManualLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;
      
      const role = email.split('@')[0];
      
      if (role === 'consumer') {
        router.replace('/(consumer)/guides');
      } else {
        const workerUrl = __DEV__ 
          ? (Platform.OS === 'web' ? 'http://localhost:3000/office?role=' + role : 'http://192.168.1.112:3000/office?role=' + role)
          : 'https://herodototest.netlify.app/office/dashboard?role=' + role;
        
        if (Platform.OS === 'web') {
          window.location.href = workerUrl;
        } else {
          alert(`Worker logged in! Please open ${workerUrl} on your desktop.`);
          setLoading(false);
        }
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message.includes('Network request failed')) {
        setErrorMsg('Database is offline. Run `supabase start` or check your .env variables.');
        setLoading(false);
      } else {
        setErrorMsg(err.message || 'Login failed.');
        setLoading(false);
      }
    }
  };

  const autofill = (r: string, e: string) => {
    setEmail(e);
    setPassword('password123'); // From seed.sql
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Herodoto</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Proper Login Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput 
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleManualLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR AUTOFILL AS</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Development Autofill Buttons */}
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => autofill('consumer', 'consumer@herodoto.art')}>
            <View style={[styles.iconContainer, { backgroundColor: '#f0fdf4' }]}>
              <User color="#16a34a" size={24} />
            </View>
            <Text style={styles.cardTitle}>Consumer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => autofill('employee', 'employee@herodoto.art')}>
            <View style={[styles.iconContainer, { backgroundColor: '#eff6ff' }]}>
              <Briefcase color="#2563eb" size={24} />
            </View>
            <Text style={styles.cardTitle}>Employee</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => autofill('manager', 'manager@herodoto.art')}>
            <View style={[styles.iconContainer, { backgroundColor: '#fdf4ff' }]}>
              <Settings color="#c026d3" size={24} />
            </View>
            <Text style={styles.cardTitle}>Manager</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => autofill('admin', 'admin@herodoto.art')}>
            <View style={[styles.iconContainer, { backgroundColor: '#fef2f2' }]}>
              <Shield color="#dc2626" size={24} />
            </View>
            <Text style={styles.cardTitle}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center'
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: 'black',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24
  },
  errorText: {
    color: '#991b1b',
    textAlign: 'center',
    fontWeight: '500'
  },
  form: {
    marginBottom: 24
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: 'black'
  },
  loginButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb'
  },
  dividerText: {
    color: '#9ca3af',
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    width: '48%',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  }
});





