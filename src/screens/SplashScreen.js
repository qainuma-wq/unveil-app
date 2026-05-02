import React, { useEffect } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    let isMounted = true;

    const startApp = async () => {
      try {
        console.log("Splash started");

        // fallback timeout (anti stuck)
        const fallback = setTimeout(() => {
          if (isMounted) {
            console.log("Fallback ke Login");
            navigation.replace("Login");
          }
        }, 2000);

        const user = await AsyncStorage.getItem("user");

        console.log("User:", user);

        // clear fallback kalau berhasil
        clearTimeout(fallback);

        if (!isMounted) return;

        if (user) {
          navigation.replace("App", {
            screen: "Home",
            params: { username: user },
          });
        } else {
          navigation.replace("Login");
        }

      } catch (e) {
        console.log("ERROR SPLASH:", e);

        if (isMounted) {
          navigation.replace("Login");
        }
      }
    };

    startApp();

    return () => {
      isMounted = false;
    };
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