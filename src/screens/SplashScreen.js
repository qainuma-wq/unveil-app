import React, { useEffect, useRef } from "react";
import { View, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  const isNavigated = useRef(false);

  useEffect(() => {
    const startApp = async () => {
      try {
        // safety fallback (kalau async bermasalah)
        const fallback = setTimeout(() => {
          if (!isNavigated.current) {
            isNavigated.current = true;
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        }, 2500);

        const user = await AsyncStorage.getItem("user");

        clearTimeout(fallback);

        if (isNavigated.current) return;
        isNavigated.current = true;

        if (user) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "Home",
                params: { username: user },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }

      } catch (e) {
        if (!isNavigated.current) {
          isNavigated.current = true;
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      }
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
  container: { flex: 1 },
  image: { flex: 1, width: "100%", height: "100%" },
});