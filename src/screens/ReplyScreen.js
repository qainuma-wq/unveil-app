import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { BackHandler } from "react-native";

export default function ReplyScreen({ route, navigation }) {
  const { tweet, username } = route.params;

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [userColor, setUserColor] = useState("#8DB0CB");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 🔥 ambil warna user
  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) {
        setUserColor(snap.data().personalColor || "#8DB0CB");
      }
    };
    fetchUser();
  }, []);

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

    return () => subscription.remove(); // ✅ FIX
  }, [username])
);

  // 🔥 keyboard listener
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 🔥 realtime replies
  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((t) => t.parentId === tweet.id);

      setReplies(data);
    });

    return unsub;
  }, []);

  // 🔥 kirim reply
  const sendReply = async () => {
    if (!reply.trim()) return;

    await addDoc(collection(db, "tweets"), {
      user: username,
      text: reply,
      color: userColor,
      parentId: tweet.id,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
    });

    setReply("");
  };

  // 🔥 DELETE
  const handleDelete = async (id) => {
    Alert.alert("Delete", "Sure want to delete your thought?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await deleteDoc(doc(db, "tweets", id));
        },
      },
    ]);
  };

  // 🔥 render reply
  const renderReply = ({ item }) => (
    <View style={[styles.replyBox, { backgroundColor: item.color }]}>
      
      <View style={styles.topRow}>
        <Text style={styles.username}>{item.user}</Text>

        {item.user === username && (
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={18} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Replies</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ORIGINAL TWEET */}
      <View style={[styles.tweetBox, { backgroundColor: tweet.color }]}>
        <Text style={styles.username}>{tweet.user}</Text>
        <Text>{tweet.text}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={replies}
        renderItem={renderReply}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* INPUT */}
      <View
        style={[
          styles.inputWrapper,
          { bottom: keyboardHeight }
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Unveil your thoughts..."
            value={reply}
            onChangeText={setReply}
            multiline
            textAlignVertical="top"
            style={styles.input}
          />

          <TouchableOpacity style={styles.postBtn} onPress={sendReply}>
            <Text style={styles.postText}>Send</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  tweetBox: {
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  replyBox: {
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  username: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E9E3D5",
  },

  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: "#8DB0CB",
  },

  postBtn: {
    marginLeft: 10,
    backgroundColor: "#1D6F6B",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  postText: {
    color: "white",
    fontWeight: "bold",
  },
});