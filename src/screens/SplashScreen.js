
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 2500);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Unveil</Text>
      <Text style={styles.subtitle}>Every Word.</Text>
      <Image
        source={require("../../assets/character.png")}
        style={styles.character}
        resizeMode="contain"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E9E3D5",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  character: {
    width: 250,
    height: 250,
    position: "absolute",
    bottom: 0,
  },
});
