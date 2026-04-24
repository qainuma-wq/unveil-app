import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) setData(snap.data());
    };
    fetch();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  if (!data) return null;

  return (
    <View style={styles.container}>
      <Image source={avatars[data.avatar]} style={styles.avatar} />

      <Text style={styles.username}>{data.username}</Text>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  note: {
    marginTop: 10,
    color: "#555",
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
  back: {
    marginTop: 15,
  },
});