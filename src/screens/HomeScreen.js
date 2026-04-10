import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

// import { db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
// } from "firebase/firestore";

export default function HomeScreen({ route }) {
  const { username } = route.params;

  const [tab, setTab] = useState("unfolding");
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);

  // 🔥 AMBIL DATA REALTIME DARI FIREBASE
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

  // const postTweet = async () => {
  //   if (tweet.trim() === "") return;

  //   await addDoc(collection(db, "tweets"), {
  //     user: username,
  //     text: tweet,
  //     createdAt: new Date(),
  //   });

  //   setTweet("");
  // };

  const renderTweet = ({ item }) => (
    <View style={styles.tweetBox}>
      <Text style={styles.username}>{item.user}</Text>
      <Text style={styles.tweetText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Tabs */}
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

      {/* Tweets */}
      <FlatList
        data={
          tab === "unfolding"
            ? tweets
            : tweets.filter((t) => t.user === username)
        }
        renderItem={renderTweet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Unveil your thoughts..."
          value={tweet}
          onChangeText={setTweet}
          style={styles.input}
        />

        <TouchableOpacity style={styles.postBtn} onPress={postTweet}>
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

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  tabText: {
    fontSize: 18,
    color: "#1D6F6B",
  },

  active: {
    fontWeight: "bold",
  },

  tweetBox: {
    backgroundColor: "#8EB1CC",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: 350,
    alignSelf: "center",
  },

  username: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  tweetText: {
    fontSize: 14,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  input: {
    flex: 1,
    backgroundColor: "#E5C66A",
    padding: 15,
    borderRadius: 15,
  },

  postBtn: {
    marginLeft: 10,
    backgroundColor: "#1D6F6B",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  postText: {
    color: "white",
    fontWeight: "bold",
  },
});