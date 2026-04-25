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
} from "firebase/firestore";

export default function ReplyScreen({ route, navigation }) {
  const { tweet, username } = route.params;

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#8EB1CC");
  const [showColors, setShowColors] = useState(false);

  const colors = ["#FFC0CB", "#C1E1C1", "#ADD8E6", "#FFFACD"];

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

  const sendReply = async () => {
    if (!reply.trim()) return;

    await addDoc(collection(db, "tweets"), {
      user: username,
      text: reply,
      color: selectedColor,
      createdAt: serverTimestamp(),
      likes: 0,
      likedBy: [],
      parentId: tweet.id,
    });

    setReply("");
    setSelectedColor("#8EB1CC");
    setShowColors(false);
  };

  const getUsernameStyle = (name) => {
    if (name.length > 15) return styles.usernameSmall;
    if (name.length > 10) return styles.usernameMedium;
    return styles.username;
  };

  const renderReply = ({ item }) => (
    <View style={[styles.replyBox, { backgroundColor: item.color }]}>
      
      {/* USERNAME + REPLIED */}
      <View style={styles.row}>
        <Text style={getUsernameStyle(item.user)}>
          {item.user}
        </Text>
        <Text style={styles.replied}>  replied</Text>
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
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* COLOR PICKER */}
      {showColors && (
        <View style={styles.colors}>
          {colors.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => {
                setSelectedColor(c);
                setShowColors(false);
              }}
              style={[styles.colorCircle, { backgroundColor: c }]}
            />
          ))}
        </View>
      )}

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Unveil your voice..."
          value={reply}
          onFocus={() => setShowColors(true)}
          onChangeText={setReply}
          style={[styles.input, { backgroundColor: selectedColor }]}
        />

        <TouchableOpacity style={styles.postBtn} onPress={sendReply}>
          <Text style={styles.postText}>Send</Text>
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
    alignItems: "center",
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
    fontSize: 12,
  },

  usernameSmall: {
    fontWeight: "bold",
    fontSize: 16,
  },

  replied: {
    fontSize: 15,
    color: "#666262",
  },

  colors: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  colorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginHorizontal: 6,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
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