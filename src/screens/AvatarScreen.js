import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";

import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; // ✅ FIX DI SINI
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

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

const colors = [
  "#E6DC9A",
  "#8FAFCC",
  "#E3A1AA",
  "#D98F99",
  "#A8CFA9",
  "#BFEDE3",
  "#C9B6A6",
  "#CBBBEA",
  "#AFC7C2",
];

export default function AvatarScreen({ route, navigation }) {
  const { username } = route.params;

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const finishSetup = async () => {
    if (selectedAvatar === null || selectedColor === null) {
      alert("Pick your personal avatar AND color");
      return;
    }

    // 🔥 SIMPAN KE FIREBASE (FIX)
    await setDoc(
      doc(db, "users", username),
      {
        avatar: selectedAvatar,
        personalColor: selectedColor,
      },
      { merge: true }
    );

    await AsyncStorage.setItem("user", username);

    navigation.replace("App", {
      screen: "Home",
      params: { username },
    });
  };

  return (
    <View style={styles.wrapper}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.title}>Choose your identity</Text>

      <Text style={styles.note}>
        Pick your ONCE in a lifetime profile picture!
      </Text>

      {/* AVATAR */}
      <View style={styles.container}>
        {avatars.map((img, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedAvatar(i)}>
            <Image
              source={img}
              style={[
                styles.avatar,
                selectedAvatar === i && styles.selected,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* COLOR */}
      <Text style={styles.subtitle}>Choose your theme color</Text>

      <View style={styles.colorContainer}>
        {colors.map((color, i) => (
          <TouchableOpacity key={i} onPress={() => setSelectedColor(color)}>
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                selectedColor === color && styles.selected,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={finishSetup}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#E9E3D5",
    alignItems: "center",
    paddingTop: 50,
  },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  note: {
    fontSize: 13,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
  },

  selected: {
    borderWidth: 3,
    borderColor: "#000",
  },

  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "500",
  },

  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 180,
  },

  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#1D6F6B",
    padding: 15,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 1,
  },
});