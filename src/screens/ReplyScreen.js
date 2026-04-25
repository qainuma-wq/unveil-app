import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

export default function ReplyScreen({ route, navigation }) {
  const { tweet, username } = route.params;

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [userColor, setUserColor] = useState("#8DB0CB");

  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) {
        setUserColor(snap.data().personalColor || "#8DB0CB");
      }
    };
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tweets", id));
  };

  // realtime replies
  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((t) => t.parentId === tweet.id);

      setReplies(data);
    });

    return unsubscribe;
  }, []);

  // send reply
  const sendReply = async () => {
    if (!reply.trim()) return;

    await addDoc(collection(db, "tweets"), {
      user: username,
      text: reply,
      color: userColor,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      parentId: tweet.id,
    });

    setReply("");
  };

  const getUsernameStyle = (name) => {
    if (name.length > 15) return styles.usernameSmall;
    if (name.length > 10) return styles.usernameMedium;
    return styles.username;
  };

  const renderReply = ({ item }) => (
    <View style={[styles.replyBox, { backgroundColor: item.color }]}>
      <View style={styles.row}>
        <Text style={getUsernameStyle(item.user)}>
          {item.user}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.replied}> replied</Text>

          {item.user === username && (
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="trash-outline" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.text}>{item.text}</Text>
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
        <Text style={styles.text}>{tweet.text}</Text>
      </View>

      {/* REPLIES */}
      <FlatList
        data={replies}
        renderItem={renderReply}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* INPUT */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Unveil your side..."
            value={reply}
            onChangeText={setReply}
            multiline
            textAlignVertical="top"
            style={styles.input} // 🔥 FIXED COLOR (no userColor lagi)
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  username: {
    fontWeight: "bold",
    fontSize: 16,
  },

  usernameMedium: {
    fontWeight: "bold",
    fontSize: 14,
  },

  usernameSmall: {
    fontWeight: "bold",
    fontSize: 12,
  },

  replied: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },

  text: {
    flexWrap: "wrap",
    lineHeight: 20,
  },

  inputWrapper: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#E9E3D5",
    boxShadow: '0 4px 7px rgba(0, 0, 0, 0.5)'
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    minHeight: 45,
    maxHeight: 120,
    backgroundColor: "#8DB0CB", // 🔥 INI YANG DIGANTI
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