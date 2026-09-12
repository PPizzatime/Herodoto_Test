import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Square, MapPin, ArrowLeft } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { DEMO_GUIDES } from '../../../lib/data';

const DEFAULT_GUIDE = {
  id: '1',
  title: 'Trevi Fountain',
  image: 'https://picsum.photos/seed/trevi/800/400',
  intro: {
    description: 'Welcome to this historic monument. This guide will walk you through its history, architecture, and legends.',
    coordinates: { lat: 41.9009, lng: 12.4833 }
  },
  sections: [
    {
      id: 'poi-1',
      title: 'The Facade',
      description: 'The architecture here is some of the most famous in the world. Take a moment to notice the intricate sculptures.',
      ttsText: 'Welcome. Before you is a spectacular facade. Notice the central figures and the architecture.',
    },
    {
      id: 'poi-2',
      title: 'Legends & Traditions',
      description: 'It is a tradition to take a moment and reflect here. Countless people have stood where you are standing now.',
      ttsText: 'Legend has it that this location has mystical properties. Try it yourself and experience the magic.',
    }
  ]
};

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Find the guide from DEMO_GUIDES to get its title and image
  const baseGuide = DEMO_GUIDES.find(g => g.id === id) || DEMO_GUIDES[0];
  const guideData = {
    ...DEFAULT_GUIDE,
    title: baseGuide.title,
    image: baseGuide.image || DEFAULT_GUIDE.image
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      if (Platform.OS !== 'web') {
        Speech.stop();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToSpeak = guideData.sections[currentSectionIndex].ttsText;
      if (Platform.OS !== 'web') {
        Speech.speak(textToSpeak, {
          onDone: () => setIsPlaying(false),
          onError: () => setIsPlaying(false)
        });
      } else {
        // Web Speech API fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        } else {
          console.log('Web Speech API not supported in this browser.');
          setIsPlaying(false);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (Platform.OS !== 'web') {
        Speech.stop();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{guideData.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView>
        <Image source={{ uri: guideData.image }} style={styles.heroImage} resizeMode="cover" />
        
        <View style={styles.content}>
          <Text style={styles.introTitle}>Overview</Text>
          <Text style={styles.introText}>{guideData.intro.description}</Text>
          
          <View style={styles.sectionsContainer}>
            <Text style={styles.sectionsHeader}>Tour Stops</Text>
            {guideData.sections.map((section, index) => (
              <TouchableOpacity 
                key={section.id} 
                style={[
                  styles.sectionCard,
                  currentSectionIndex === index && styles.activeSectionCard
                ]}
                onPress={() => {
                  setCurrentSectionIndex(index);
                  if (isPlaying) handlePlayPause(); // Stop current speech if changing section
                }}
              >
                <Text style={styles.sectionTitle}>{index + 1}. {section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.playerContainer}>
        <View style={styles.playerInfo}>
          <Text style={styles.nowPlayingText}>Now Playing</Text>
          <Text style={styles.currentSectionText}>{guideData.sections[currentSectionIndex].title}</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying ? <Square color="white" fill="white" size={24} /> : <Play color="white" fill="white" size={24} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  heroImage: { width: '100%', height: 220 },
  content: { padding: 16, paddingBottom: 100 },
  introTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  introText: { fontSize: 16, color: '#444', lineHeight: 24 },
  sectionsContainer: { marginTop: 32 },
  sectionsHeader: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sectionCard: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  activeSectionCard: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0'
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playerInfo: { flex: 1 },
  nowPlayingText: { color: '#888', fontSize: 12, textTransform: 'uppercase', fontWeight: '600' },
  currentSectionText: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 2 },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16
  }
});
