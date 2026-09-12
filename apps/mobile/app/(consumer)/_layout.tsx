import { Tabs } from 'expo-router';
import { Globe, Map as MapIcon, Bell, User, Smile } from 'lucide-react-native';
import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';

export default function ConsumerLayout() {
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
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />
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
