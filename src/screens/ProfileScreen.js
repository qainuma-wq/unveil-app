import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const avatars = [
  require("../../assets/avatars/1.png"),
  require("../../assets/avatars/2.png"),
  require("../../assets/avatars/3.png"),
  require("../../assets/avatars/4.png"),
  require("../../assets/avatars/5.png"),
  require("../../assets/avatars/6.png"),
  require("../../assets/avatars/7.png"),
  require("../../assets/avatars/8.png"),
  require("../../assets/avatars/9.png"),
];

export default function ProfileScreen({ route, navigation }) {
  const { username } = route.params;
  const [data, setData] = useState(null);

  // 🔥 ambil data user
  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) setData(snap.data());
    };
    fetch();
  }, [username]);

  // 🔥 BACK BUTTON HP → balik ke Home
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home", { username });
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove(); // ✅ NO ERROR
    }, [username])
  );

  // 🔥 LOGOUT FIX (INI YANG PENTING)
  const logout = async () => {
    await AsyncStorage.removeItem("user");

    // 👇 ambil navigator atas (yang punya Login)
    const parent = navigation.getParent();

    if (parent) {
      parent.navigate("Login"); // ✅ FIX error navigator
    } else {
      navigation.navigate("Login");
    }
  };

  if (!data) return null;

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", { username })}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Profile</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Image source={avatars[data.avatar]} style={styles.avatar} />

        <Text style={styles.username}>{data.username}</Text>

        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9E3D5",
    paddingTop: 60,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  username: {
    fontSize: 20,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#E5C66A",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },

  buttonText: {
    fontWeight: "bold",
  },
});