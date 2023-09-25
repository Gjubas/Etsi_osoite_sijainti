import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  TextInput,
  Button,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 60.201373,
    longitude: 24.934041,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  const fetchLocationData = async (searchText) => {
    try {
      const response = await fetch(
        `https://www.mapquestapi.com/geocoding/v1/address?key=usNL28gnUzjXg2W68XJldOIbOMNRNqrA&location=${searchText}`
      );

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      console.log("Location:", location);
    })();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetchLocationData(searchText);

      if (response.results && response.results.length > 0) {
        const { lat, lng } = response.results[0].locations[0].latLng;
        setCoordinates({ latitude: lat, longitude: lng });
        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        });
      } else {
        Alert.alert("Location not found");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      Alert.alert("Error searching for location");
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={coordinates} title={searchText} />
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Enter an address"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button title="Show" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "70%",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  },
});
