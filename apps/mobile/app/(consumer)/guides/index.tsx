import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Clock, MapPin, Smile } from 'lucide-react-native';
import * as Location from 'expo-location';

import { DEMO_GUIDES } from '../../../lib/data';

// Haversine formula to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

export default function GuidesListScreen() {
  const router = useRouter();
  const [activeTab, setactiveTab] = useState<'GUIDES' | 'OFFERS' | 'HISTORY'>('GUIDES');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [sortedGuides, setSortedGuides] = useState(DEMO_GUIDES);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        
        // Sort guides by distance
        const guidesWithDistance = DEMO_GUIDES.map(guide => ({
          ...guide,
          distance: getDistanceFromLatLonInKm(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            guide.lat,
            guide.lng
          )
        }));
        
        guidesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        setSortedGuides(guidesWithDistance);
      } catch (e) {
        console.log('Location error:', e);
      }
    })();
  }, []);

  const renderGuide = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => router.push("/(consumer)/guides/" + item.id)}
    >
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12, resizeMode: 'cover' }}>
        <View style={styles.cardOverlay}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.distance !== undefined && (
              <View style={styles.distanceBadge}>
                <MapPin color="white" size={12} />
                <Text style={styles.distanceText}>{item.distance < 1 ? '< 1 km' : Math.round(item.distance) + ' km'} away</Text>
              </View>
            )}
          </View>
          <View style={styles.statusIcon}>
            {item.status === 'COMPLETED' ? (
              <CheckCircle2 color="#4ade80" size={24} />
            ) : (
              <Clock color="#facc15" size={24} />
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'GUIDES' && styles.activeTab]} onPress={() => setactiveTab('GUIDES')}>
          <Text style={[styles.tabText, activeTab === 'GUIDES' && styles.activeTabText]}>Guides</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'OFFERS' && styles.activeTab]} onPress={() => setactiveTab('OFFERS')}>
          <Text style={[styles.tabText, activeTab === 'OFFERS' && styles.activeTabText]}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'HISTORY' && styles.activeTab]} onPress={() => setactiveTab('HISTORY')}>
          <Text style={[styles.tabText, activeTab === 'HISTORY' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'GUIDES' && (
        <FlatList
          data={sortedGuides}
          keyExtractor={(item) => item.id}
          renderItem={renderGuide}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}

      {activeTab === 'OFFERS' && (
        <View style={styles.centerContent}>
          <Text style={styles.placeholderText}>Promo Code Redemption UI</Text>
        </View>
      )}

      {activeTab === 'HISTORY' && (
        <FlatList
          data={sortedGuides.filter(g => g.status !== 'UNSTARTED')}
          keyExtractor={(item) => item.id}
          renderItem={renderGuide}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  list: { padding: 8 },
  cardContainer: {
    flex: 1,
    height: 160,
    margin: 8,
    borderRadius: 12,
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
    elevation: 4,
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: 'white',
    textShadow: '1px 1px 3px rgba(0,0,0,1)',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textShadow: '1px 1px 2px rgba(0,0,0,1)',
  },
  statusIcon: {
    marginLeft: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666'
  }
});




