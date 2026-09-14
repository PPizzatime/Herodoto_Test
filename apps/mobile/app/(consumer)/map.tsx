import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, Image } from "react-native";
import { supabase } from "../../lib/supabase";

export default function MapScreen() {
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("guide_versions").select("*");
      if (data) {
        const dedupedMap = new Map();
        data.forEach(g => {
          if (!dedupedMap.has(g.guide_id)) {
            dedupedMap.set(g.guide_id, g);
          }
        });
        setGuides(Array.from(dedupedMap.values()));
      }
    }
    load();
  }, []);

  if (Platform.OS === "web") {
    const markersJs = guides.filter(g => g.lat && g.lng).map(g => 
      `L.marker([${g.lat}, ${g.lng}]).addTo(map).bindPopup(\`<div style="text-align:center;"><b>${g.title || ""}</b><br/><img src="${g.image_url || ""}" style="width:60px;height:60px;object-fit:cover;border-radius:30px;margin-top:5px;border:2px solid white;box-shadow:0px 2px 4px rgba(0,0,0,0.3);"/></div>\`);`
    ).join("\n");

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
          var map = L.map("map").setView([19.4326, -99.1332], 4);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "OpenStreetMap"
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
           style={{ width: "100%", height: "100%", border: "none" }}
           title="Interactive Map"
         />
      </View>
    );
  }

  const Mapbox = require("@rnmapbox/maps").default;
  Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || "pk.placeholder");

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={4}
            centerCoordinate={[-99.1332, 19.4326]}
          />
          {guides.filter(g => g.lat && g.lng).map((guide) => (
            <Mapbox.PointAnnotation
              key={guide.id || guide.guide_id}
              id={guide.id || guide.guide_id}
              coordinate={[guide.lng, guide.lat]}
            >
              <View style={styles.markerContainer}>
                {guide.image_url ? (
                  <Image source={{ uri: guide.image_url }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.marker} />
                )}
              </View>
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5FCFF" },
  container: { height: "100%", width: "100%" },
  map: { flex: 1 },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "white",
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#ccc",
  }
});

