import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";

export default function HomeScreen({ route, navigation }) {
  const { username } = route.params;

  const [tab, setTab] = useState("unfolding");
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [userAvatar, setUserAvatar] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#FFB6C1");
  const [isFocused, setIsFocused] = useState(false);

  const colors = ["#FFB6C1", "#C1F0C1", "#C1E1FF", "#FFF3B0"];

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

  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", username));
      if (snap.exists()) {
        setUserAvatar(snap.data().avatar || 0);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(data);
    });

    return unsubscribe;
  }, []);

  const postTweet = async () => {
    if (!tweet.trim()) return;

    await addDoc(collection(db, "tweets"), {
      user: username,
      text: tweet,
      avatar: userAvatar,
      color: selectedColor,
      likes: 0,
      likedBy: [],
      parentId: null,
      createdAt: new Date(),
    });

    setTweet("");
    setSelectedColor("#FFB6C1");
    setIsFocused(false);
  };

  const handleLike = async (item) => {
    const ref = doc(db, "tweets", item.id);
    const liked = item.likedBy?.includes(username);

    if (liked) {
      await updateDoc(ref, {
        likes: increment(-1),
        likedBy: item.likedBy.filter((u) => u !== username),
      });
    } else {
      await updateDoc(ref, {
        likes: increment(1),
        likedBy: [...(item.likedBy || []), username],
      });
    }
  };

  const getReplyCount = (id) =>
    tweets.filter((t) => t.parentId === id).length;

  const mainTweets = tweets.filter(
    (t) => t.parentId === null || t.parentId === undefined
  );

  const renderTweet = ({ item }) => {
    const isLiked = item.likedBy?.includes(username);
    const replyCount = getReplyCount(item.id);

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.tweetBox,
            { backgroundColor: item.color || "#8EB1CC" },
          ]}
        >
          <Image source={avatars[item.avatar || 0]} style={styles.avatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{item.user}</Text>

            {/* 🔥 TEXT FIX (wrap ke bawah) */}
            <Text style={styles.tweetText}>{item.text}</Text>

            <View style={styles.actionRow}>
              
              {replyCount > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Reply", { tweet: item, username })
                  }
                >
                  <Text style={styles.replyText}>
                    See Replies ({replyCount})
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.rightActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleLike(item)}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "red" : "black"}
                  />
                  <Text style={styles.count}>{item.likes || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    navigation.navigate("Reply", { tweet: item, username })
                  }
                >
                  <Ionicons name="chatbubble-outline" size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Unveil</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { username })}
        >
          <Ionicons name="person-outline" size={24} />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("unfolding")}>
          <Text style={[styles.tabText, tab === "unfolding" && styles.active]}>
            Unfolding
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab("yours")}>
          <Text style={[styles.tabText, tab === "yours" && styles.active]}>
            Yours
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          tab === "unfolding"
            ? mainTweets
            : mainTweets.filter((t) => t.user === username)
        }
        renderItem={renderTweet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* INPUT AREA */}
      <View style={styles.bottomArea}>
        
        {isFocused && (
          <View style={styles.colorWrapper}>
            <View style={styles.colorRow}>
              {colors.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedColor(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    selectedColor === c && styles.selectedDot,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Unveil your thoughts..."
            value={tweet}
            onChangeText={setTweet}
            onFocus={() => setIsFocused(true)}
            multiline={true} 
            textAlignVertical="top"
            style={[styles.input, { backgroundColor: selectedColor }]}
          />

          <TouchableOpacity style={styles.postBtn} onPress={postTweet}>
            <Text style={styles.postText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9E3D5", paddingTop: 60 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  title: { fontSize: 26, fontWeight: "bold" },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 15,
  },

  tabText: { fontSize: 18, color: "#1D6F6B" },

  active: { fontWeight: "bold" },

  wrapper: { width: "100%", alignItems: "center" },

  tweetBox: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    width: "90%",
  },

  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },

  username: { fontWeight: "bold", marginBottom: 3, fontSize: 16 },

  tweetText: {
    flexWrap: "wrap",
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  rightActions: { flexDirection: "row", gap: 15 },

  iconBtn: { flexDirection: "row", alignItems: "center" },

  count: { marginLeft: 5 },

  replyText: { color: "#555" },

  bottomArea: { paddingBottom: 20 },

  colorWrapper: {
    marginBottom: 10,
  },

  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
  },

  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 6,
  },

  selectedDot: { borderWidth: 2, borderColor: "#000" },

  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    minHeight: 45,
    maxHeight: 120,
  },

  postBtn: {
    marginLeft: 10,
    backgroundColor: "#1D6F6B",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
  },

  postText: { color: "white", fontWeight: "bold" },
});