import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Fill all fields");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    const ref = doc(db, "users", cleanUsername);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      alert("Username already exists");
      return;
    }

    await setDoc(ref, {
      username: cleanUsername,
      password: password,
      avatar: null,
    });

    navigation.replace("Avatar", { username: cleanUsername });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#E9E3D5",
    padding: 25,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#E5C66A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#1D6F6B",
  },
});