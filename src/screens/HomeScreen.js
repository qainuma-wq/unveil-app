import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Keyboard
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { BackHandler, ToastAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

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
  deleteDoc,
} from "firebase/firestore";

export default function HomeScreen({ route, navigation }) {
  const { username } = route.params;

  const [tab, setTab] = useState("unfolding");
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  const [userAvatar, setUserAvatar] = useState(0);
  const [userColor, setUserColor] = useState(null);

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

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tweets", id));
  };

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const snap = await getDoc(doc(db, "users", username));

      if (snap.exists()) {
        const data = snap.data();

        if (data.avatar === null || data.personalColor === null) {
          navigation.replace("Avatar", { username });
          return;
        }

        setUserAvatar(data.avatar || 0);
        setUserColor(data.personalColor || "#FFB6C1");
      }
    };

    fetchUser();
  }, []);

  const backPressCount = useRef(0);

useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);

        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove(); // ✅ FIX DI SINI
  }, [])
);

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
    if (!tweet.trim() || !userColor) return;

    await addDoc(collection(db, "tweets"), {
      user: username,
      text: tweet,
      avatar: userAvatar,
      color: userColor,
      likes: 0,
      likedBy: [],
      parentId: null,
      createdAt: new Date(),
    });

    setTweet("");
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
        <View style={[styles.tweetBox, { backgroundColor: item.color || "#8EB1CC" }]}>
          <Image source={avatars[item.avatar || 0]} style={styles.avatar} />

          <View style={{ flex: 1 }}>

            <View style={styles.topRow}>
              <Text style={styles.username}>{item.user}</Text>

              {item.user === username && (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="black" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.tweetText}>{item.text}</Text>

            <View style={styles.actionRow}>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Reply", { tweet: item, username })
                }
              >
                <Text style={styles.replyText}>
                  See Replies ({replyCount})
                </Text>
              </TouchableOpacity>

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

      <View style={styles.header}>
        <Text style={styles.title}>Unveil</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile", { username })}>
          <Ionicons name="person-outline" size={24} />
        </TouchableOpacity>
      </View>

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
      <View
        style={[
          styles.inputWrapper,
          { bottom: keyboardHeight } // 🔥 INI KUNCINYA
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Unveil your thoughts..."
            value={tweet}
            onChangeText={setTweet}
            multiline
            textAlignVertical="top"
            style={styles.input}
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
    fontSize: 26,
    fontWeight: "bold",
  },

  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 15,
  },

  tabText: {
    fontSize: 18,
    color: "#1D6F6B",
  },

  active: {
    fontWeight: "bold",
  },

  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  tweetBox: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    width: "90%",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  username: {
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 16,
  },

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

  rightActions: {
    flexDirection: "row",
    gap: 15,
  },

  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  count: {
    marginLeft: 5,
  },

  replyText: {
    color: "#555",
  },

  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "flex-end",
    paddingTop: 20,
    boxShadow: '0 4px 7px rgba(0, 0, 0, 0.5)'
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    minHeight: 15,
    maxHeight: 120,
    backgroundColor: "#8DB0CB",
  },

  postBtn: {
    marginLeft: 10,
    backgroundColor: "#1D6F6B",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
  },

  postText: {
    color: "white",
    fontWeight: "bold",
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
});