import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { CheckCircle2, Clock, MapPin, Smile } from 'lucide-react-native';
import * as Location from 'expo-location';

import { supabase } from '../../../lib/supabase';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

export default function GuidesListScreen() {
  const router = useRouter();
  const [activeTab, setactiveTab] = useState<'GUIDES' | 'OFFERS' | 'HISTORY'>('GUIDES');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  const [sortedGuides, setSortedGuides] = useState<any[]>([]);
  const [offerGuides, setOfferGuides] = useState<any[]>([]);
  const [historyGuides, setHistoryGuides] = useState<any[]>([]);

  // Get location once on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        } catch (e) {
          console.log('Location error:', e);
        }
      }
    })();
  }, []);

  // useFocusEffect triggers every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchGuidesData = async () => {
        // Fetch published guides, their active version, and images
        const { data: gList } = await supabase
          .from('guides')
          .select('*, guide_versions!guides_active_version_id_fkey(*), guide_images(*)')
          .eq('status', 'PUBLISHED')
          .is('deleted_at', null);
          
        const { data: activePromos } = await supabase.from('promos').select('guide_id').eq('status', 'ACTIVE');
        const promoGuideIds = new Set(activePromos?.map(p => p.guide_id) || []);

        // Fetch user history
        const { data: { user } } = await supabase.auth.getUser();
        let historyMap = new Map();
        if (user) {
          // Look up activity logs for history
          const { data: historyLogs } = await supabase.from('activity_logs').select('*').eq('user_id', user.id).eq('action', 'OPEN_GUIDE');
          if (historyLogs) {
            historyLogs.forEach((h: any) => historyMap.set(h.details?.guide_id, 'OPENED'));
          }
          
          // Also fallback to user_guide_history
          const { data: historyList } = await supabase.from('user_guide_history').select('*').eq('user_id', user.id);
          if (historyList) {
            historyList.forEach((h: any) => historyMap.set(h.guide_id, h.status));
          }
        }

        if (gList && isActive) {
          const allGuides = gList.map((g: any) => {
            const gv = g.guide_versions || {};
            let distance;
            if (location && gv.lat && gv.lng) {
              distance = getDistanceFromLatLonInKm(
                location.coords.latitude,
                location.coords.longitude,
                gv.lat,
                gv.lng
              );
            }
            
            // Prefer first guide_image, otherwise fallback to version image_url
            const firstImage = (g.guide_images && g.guide_images.length > 0) 
                ? g.guide_images[0].image_url 
                : (gv.image_url || 'https://via.placeholder.com/400?text=No+Image');

            return {
              ...gv,
              id: g.id,
              image: firstImage,
              distance,
              historyStatus: historyMap.get(g.id)
            };
          });

          // Sort by distance
          allGuides.sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setSortedGuides(allGuides);
          
          // OFFERS filter using promos table
          setOfferGuides(allGuides.filter((g: any) => promoGuideIds.has(g.id)));

          // HISTORY
          setHistoryGuides(allGuides.filter((g: any) => g.historyStatus));
        }
      };

      fetchGuidesData();

      return () => {
        isActive = false;
      };
    }, [location]) // re-run if location changes
  );

  const renderGuide = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => router.push("/(consumer)/guides/" + item.id)}
    >
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12, resizeMode: 'cover' }}>
        <View style={styles.cardOverlay}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            
          {item.points_reward !== undefined && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4, backgroundColor: 'rgba(250,204,21,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start'}}>
              <Smile color="#facc15" size={12} />
              <Text style={{fontSize: 12, color: '#facc15', fontWeight: 'bold'}}>{item.points_reward} pts</Text>
            </View>
          )}

            {item.distance !== undefined && (
              <View style={styles.distanceBadge}>
                <MapPin color="white" size={12} />
                <Text style={styles.distanceText}>{item.distance < 1 ? '< 1 km' : Math.round(item.distance) + ' km'} away</Text>
              </View>
            )}
          </View>
          {item.historyStatus && (
            <View style={styles.statusIcon}>
              {item.historyStatus === 'COMPLETED' ? (
                <CheckCircle2 color="#4ade80" size={24} />
              ) : (
                <Clock color="#facc15" size={24} />
              )}
            </View>
          )}
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
        <FlatList
          data={offerGuides}
          keyExtractor={(item) => item.id}
          renderItem={renderGuide}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}

      {activeTab === 'HISTORY' && (
        <FlatList
          data={historyGuides}
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
