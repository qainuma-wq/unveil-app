import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AvatarScreen from "../screens/AvatarScreen";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ReplyScreen from "../screens/ReplyScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Reply" component={ReplyScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* SPLASH (cek user login atau belum) */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* AUTH */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* AVATAR SETUP */}
        <Stack.Screen name="Avatar" component={AvatarScreen} />

        {/* MAIN APP */}
        <Stack.Screen name="App" component={AppStack} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}