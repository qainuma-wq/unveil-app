import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function AvatarScreen({ route, navigation }) {
  const { username } = route.params;

  const selectAvatar = async (index) => {
    await updateDoc(doc(db, "users", username), {
      avatar: index,
    });

    await AsyncStorage.setItem("user", username);

    navigation.replace("Home", { username });
  };

  return (
    <View style={styles.wrapper}>
      
      <Text style={styles.title}>Choose your identity</Text>

      <Text style={styles.note}>
        Pick your ONCE in a lifetime profile picture!
      </Text>

      <View style={styles.container}>
        {avatars.map((img, i) => (
          <TouchableOpacity key={i} onPress={() => selectAvatar(i)}>
            <Image source={img} style={styles.avatar} />
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#E9E3D5",
    alignItems: "center",
    paddingTop: 80,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },

  note: {
    fontSize: 13,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
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
});