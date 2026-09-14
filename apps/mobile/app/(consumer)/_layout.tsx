import { Tabs } from 'expo-router';
import { Globe, Map as MapIcon, Bell, User, Smile } from 'lucide-react-native';
import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ConsumerLayout() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        fetchUnreadCount(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('mobile-notifications-badge')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        fetchUnreadCount(userId);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        fetchUnreadCount(userId);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        fetchUnreadCount(userId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchUnreadCount = async (uid: string) => {
    const { data } = await supabase.from('notifications').select('id').eq('user_id', uid).eq('is_read', false);
    if (data) {
      setUnreadCount(data.length);
    }
  };

  return (
    <Tabs screenOptions={{ 
      headerShown: true, 
      tabBarActiveTintColor: 'black',
      header: () => (
        <SafeAreaView style={{ backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Smile color="#000" size={18} />
            <Text style={{ marginLeft: 6, fontWeight: '800', fontSize: 18 }}>Herodoto</Text>
          </View>
        </SafeAreaView>
      )
    }}>
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Globe color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="guides" 
        options={{ 
          title: 'Guides',
          tabBarIcon: ({ color, size }) => <MapIcon color={color} size={size} />
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: 'red' }
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }} 
      />
    </Tabs>
  );
}

