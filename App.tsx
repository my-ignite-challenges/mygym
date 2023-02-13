import { StatusBar } from "react-native";

import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { Loading } from "@components/Loading";
import { theme } from "./src/theme";
import { Routes } from "./src/routes";
import { AuthProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthProvider>{fontsLoaded ? <Routes /> : <Loading />}</AuthProvider>
    </NativeBaseProvider>
  );
}
