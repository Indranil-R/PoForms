import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Alert, Linking, StatusBar, StyleSheet, TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack 
    initialRouteName="index" 
    screenOptions={{ 
      title: "PO Forms",
      headerStyle: headerStyles.headerContainer,
      headerTitleStyle: headerStyles.headerTitle,
      headerTintColor: '#FFFFFF', // White back button and other controls
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const appVersion = "1.0.0";
            Alert.alert(
              "About This App",
              `Nexaray Tech\nVersion: ${appVersion}\n\nThis application provides convenient access to Post Office forms and documentation.\n\nWe are an independent service provider and not affiliated with any government entity.`,
              [
                {
                  text: "Privacy Policy",
                  onPress: () =>
                    Linking.openURL("https://github.com/Indranil-R/PoForms?tab=readme-ov-file#-privacy-policy").catch(() => 
                      Alert.alert(
                        "Connection Error", 
                        "Could not open the privacy policy. Please check your internet connection and try again."
                      )
                    ),
                  style: 'default',
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
                  style: 'default',
                },
                { 
                  text: "Close", 
                  style: "cancel" 
                },
              ],
              { cancelable: true }
            );
          }}
          style={headerStyles.infoButton}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="information-circle" 
            size={22} 
            color="#FFFFFF" 
            style={headerStyles.infoIcon} 
          />
        </TouchableOpacity>
      ),
    }} 
  />
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#3D1127', // Apple red color for the header  
  },
  headerTitle: {
    color: '#FFFFFF', // White text
    fontSize: 20,
    fontWeight: '600',
  },
  infoButton: {
    marginRight: 16,
    padding: 8,
    // borderRadius: 20,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)', // Subtle white background
  },
  infoIcon: {
    color: '#FFFFFF', // White icon
  },
  // Alert button styles
  alertButtonPrimary: {
    color: '#9C1D2A', // Red text for primary actions
    fontWeight: '600',
  },
  alertButtonSecondary: {
    color: '#000000', // Black text for secondary actions
    fontWeight: '400',
  },
  alertButtonCancel: {
    color: '#000000', // Black text for cancel button
    fontWeight: '500',
  },
});