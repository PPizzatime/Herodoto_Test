import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { DEMO_GUIDES } from '../../lib/data';

export default function MapScreen() {
  if (Platform.OS === 'web') {
    // Generate Leaflet HTML dynamically to show multiple markers without installing heavy web libraries
    const markersJs = DEMO_GUIDES.map(g => 
      `L.marker([${g.lat}, ${g.lng}]).addTo(map).bindPopup('<b>${g.title}</b>');`
    ).join('\n');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([19.4326, -99.1332], 4);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);
          ${markersJs}
        </script>
      </body>
      </html>
    `;

    return (
      <View style={styles.page}>
         <iframe 
           srcDoc={htmlContent}
           style={{ width: '100%', height: '100%', border: 'none' }}
           title="Interactive Map"
         />
      </View>
    );
  }

  // Native Platform Mapbox Logic
  const Mapbox = require('@rnmapbox/maps').default;
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || 'pk.placeholder');

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={4}
            centerCoordinate={[-99.1332, 19.4326]} // CDMX
          />
          {DEMO_GUIDES.map((guide) => (
            <Mapbox.PointAnnotation
              key={guide.id}
              id={guide.id}
              coordinate={[guide.lng, guide.lat]}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker} />
              </View>
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F5FCFF' },
  container: { height: '100%', width: '100%' },
  map: { flex: 1 },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  }
});
