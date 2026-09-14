import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image, Alert, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Square, MapPin, ArrowLeft, Smile, Camera } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { supabase } from '../../../lib/supabase';

export default function GuideScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [guide, setGuide] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const fetchImages = async () => {
    const { data: imgData } = await supabase.from('guide_images').select('*').eq('guide_id', id);
    if (imgData) {
      setImages(imgData);
    }
  };

  useEffect(() => {
    (async () => {
      // 1. Fetch Guide details
      const { data: gv } = await supabase.from('guide_versions').select('*').eq('guide_id', id).single();
      if (gv) {
        setGuide({
          ...gv,
          sections: [
            { id: 'poi-1', title: 'Introduction', description: gv.description, ttsText: gv.description },
            { id: 'poi-2', title: 'Historical Context', description: 'This place holds incredible history.', ttsText: 'This place holds incredible history.' }
          ]
        });

        await fetchImages();

        // 2. Add to user history and activity log
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Log Activity
          await supabase.from('activity_logs').insert({
            user_id: user.id,
            action: 'OPEN_GUIDE',
            details: { guide_id: id },
            points_earned: 0
          });

          const { data: existing } = await supabase.from('user_guide_history').select('*').eq('user_id', user.id).eq('guide_id', id).maybeSingle();
          if (!existing) {
            await supabase.from('user_guide_history').insert({
              user_id: user.id,
              guide_id: id,
              status: 'IN_PROGRESS'
            });
          }
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleStop();
            return 100;
          }
          return p + 2;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = async (section: any) => {
    if (isPlaying) {
      await Speech.stop();
    }
    setActiveSection(section.id);
    setIsPlaying(true);
    setProgress(0);
    
    const options = {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => {
        setIsPlaying(false);
        setProgress(100);
      },
      onError: (err: any) => {
        console.error('Speech error', err);
        setIsPlaying(false);
      }
    };
    Speech.speak(section.ttsText, options);
  };

  const handleStop = async () => {
    await Speech.stop();
    setIsPlaying(false);
    setProgress(0);
    setActiveSection(null);
  };

  const handleUploadPhoto = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload a photo.');
      return;
    }

    const fakeImageUrl = 'https://images.unsplash.com/photo-1532468766723-5e913a4369e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

    await supabase.from('guide_images').insert({
      guide_id: id,
      image_url: fakeImageUrl,
      user_id: user.id,
      is_user_uploaded: true,
      status: 'APPROVED' // Auto-approve for demo
    });

    const rewardPoints = 50;
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'PHOTO_UPLOAD',
      details: { guide_id: id },
      points_earned: rewardPoints
    });

    Alert.alert('Success!', `Photo uploaded! You earned ${rewardPoints} points!`);
    await fetchImages();
  };

  if (!guide) {
    return <SafeAreaView style={styles.container}><Text>Loading...</Text></SafeAreaView>;
  }

  // Use the primary image from guide_versions as fallback, but prefer guide_images
  const displayImages = images.length > 0 ? images.map(img => img.image_url) : [guide.image_url];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Horizontal Carousel of Images */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={displayImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.headerImage} />
            )}
          />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{guide.title}</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 12, flexWrap: 'wrap'}}>
            <View style={styles.badge}>
              <MapPin color="#666" size={14} />
              <Text style={styles.badgeText}>Start at Main Entrance</Text>
            </View>
            {guide.points_reward !== undefined && (
              <View style={[styles.badge, {backgroundColor: 'rgba(250,204,21,0.2)'}]}>
                <Smile color="#facc15" size={14} />
                <Text style={[styles.badgeText, {color: '#facc15', fontWeight: 'bold'}]}>{guide.points_reward} pts</Text>
              </View>
            )}

            {/* Upload Photo Gamification Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
              <Camera color="#fff" size={14} />
              <Text style={styles.uploadButtonText}>Add Photo (+50 pts)</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>{guide.description}</Text>

          <View style={styles.sectionsContainer}>
            <Text style={styles.sectionsTitle}>Audio Stops</Text>
            {guide.sections.map((section: any, index: number) => (
              <View key={section.id} style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionNumber}>
                    <Text style={styles.sectionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => isPlaying && activeSection === section.id ? handleStop() : handlePlay(section)}
                  >
                    {isPlaying && activeSection === section.id ? (
                      <Square color="#ef4444" size={20} fill="#ef4444" />
                    ) : (
                      <Play color="#10b981" size={20} fill="#10b981" />
                    )}
                  </TouchableOpacity>
                </View>

                {isPlaying && activeSection === section.id && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}%</Text>
                  </View>
                )}
                
                <Text style={styles.sectionDesc}>{section.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  carouselContainer: { width: '100%', height: 250 },
  headerImage: { width: 400, height: 250, resizeMode: 'cover' }, // Hardcoded width roughly equal to device width for FlatList paging
  headerActions: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 16 },
  backButton: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20 },
  content: { padding: 16, marginTop: -20, backgroundColor: '#f5f5f5', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#111', flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e5e5e5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
  badgeText: { fontSize: 12, color: '#666', fontWeight: '600' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 4 },
  uploadButtonText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  description: { fontSize: 16, color: '#444', lineHeight: 24, marginVertical: 12 },
  sectionsContainer: { marginTop: 24 },
  sectionsTitle: { fontSize: 20, fontWeight: '700', color: '#111', marginBottom: 12 },
  sectionCard: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f9ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sectionNumberText: { color: '#0ea5e9', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111', flex: 1 },
  playButton: { padding: 8, backgroundColor: '#f8fafc', borderRadius: 20 },
  sectionDesc: { fontSize: 14, color: '#666', lineHeight: 20 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  progressBarBg: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10b981' },
  progressText: { fontSize: 12, color: '#666', width: 32 }
});
