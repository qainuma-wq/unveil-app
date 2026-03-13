import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 500);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

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
    backgroundColor: "#E9E3D5",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 260,
    height: 150,
    position: "absolute",
    top: 200,
  },

  character: {
    width: 320,
    height: 320,
    position: "absolute",
    bottom: 0,
    right: -20,
  },

});