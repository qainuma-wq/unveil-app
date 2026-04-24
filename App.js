import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainNavigator from './src/navigator/MainNavigator';
import "react-native-get-random-values";

export default function App() {
  return (
    <MainNavigator/>
  );
}


