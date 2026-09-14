import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        loadNotifications(user.id);
        
        const channel = supabase.channel('realtime-mobile-notifications')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
            loadNotifications(user.id);
          }).subscribe();
          
        return () => { supabase.removeChannel(channel); };
      }
    });
  }, []);

  async function loadNotifications(uid: string) {
    const { data } = await supabase.from('notifications')
      .select('*, actor:profiles!actor_id(first_name)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (data) setNotifications(data);
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (userId) loadNotifications(userId);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No notifications yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markAsRead(item.id)} style={[styles.card, { backgroundColor: item.is_read ? 'white' : '#eff6ff' }]}>
            <Text style={styles.title}>{item.actor?.first_name || 'Someone'} {item.message}</Text>
            <Text style={styles.message}>{new Date(item.created_at).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  message: { fontSize: 12, color: '#666', marginTop: 4 }
});
