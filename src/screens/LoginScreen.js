import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Fill all fields");
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    try {
      const ref = doc(db, "users", cleanUsername);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await AsyncStorage.removeItem("user");
        alert("User not found");
        return;
      }

      const data = snap.data();

      if (data.password !== password) {
        await AsyncStorage.removeItem("user");
        alert("Wrong password");
        return;
      }

      await AsyncStorage.setItem("user", cleanUsername);

      if (data.avatar === null) {
        navigation.replace("Avatar", { username: cleanUsername });
      } else {
        navigation.replace("Home", { username: cleanUsername }); // ✅ FIX
      }

    } catch (e) {
      alert("Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.quote}>
          Keep it anonymous. Mystery looks good on you.
        </Text>

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        {/* PASSWORD */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don’t have an account?</Text>
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
    marginBottom: 10,
    fontWeight: "600",
  },
  quote: {
    fontSize: 13,
    marginBottom: 20,
    color: "#555",
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
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#1D6F6B",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
});