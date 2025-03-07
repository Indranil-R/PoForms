import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Alert, Linking, StatusBar, TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack 
    initialRouteName="index" 
    screenOptions={{ 
      title: "PO Forms",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const appVersion = "1.0.0";
            Alert.alert(
              "About This App",
              `Nexaray Tech\nVersion: ${appVersion}\n\nThis application provides convenient access to Post Office forms and documentation. We are an independent service provider and not affiliated with any government entity.`,
              [
                {
                  text: "Check for Updates",
                  onPress: () => {
                    Alert.alert(
                      "Updates",
                      "Checking for latest version...",
                      [
                        { 
                          text: "OK",
                          style: "default" 
                        }
                      ]
                    );
                  },
                },
                {
                  text: "Rate App",
                  onPress: () =>
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE_NAME"
                    ).catch(() => 
                      Alert.alert(
                        "Connection Error", 
                        "Could not open Play Store. Please check your internet connection and try again."
                      )
                    ),
                },
                { 
                  text: "Close", 
                  style: "cancel" 
                },
              ],
              { cancelable: true }
            );
          }}
          style={{ 
            marginRight: 16,
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle" size={22} color="#3B82F6" />
        </TouchableOpacity>
      ),
    }} 
  />
  );
}
