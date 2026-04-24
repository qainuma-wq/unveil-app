import React, { useEffect } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const startApp = async () => {
      const user = await AsyncStorage.getItem("user");

      setTimeout(() => {
        if (user) {
          navigation.replace("Home", { username: user });
        } else {
          navigation.replace("Login");
        }
      }, 2000);
    };

    startApp();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/splash.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});