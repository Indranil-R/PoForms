import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Share,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import * as Print from "expo-print";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";

import forms from "@/constants/forms";
import { useState } from "react";

export default function Index() {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchText, setSearchText] = useState("");

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const Card = ({ title, description, pdfAsset }) => {
    const handlePrint = async () => {
      try {
        const asset = Asset.fromModule(pdfAsset);
        await asset.downloadAsync();
        await Print.printAsync({ uri: asset.uri });
      } catch (error) {
        alert("Printing failed: " + error.message);
      }
    };


   
    const handleShare = async () => {
      try {
        if (!pdfAsset) {
          alert("No PDF available to share.");
          return;
        }
        
        const asset = Asset.fromModule(pdfAsset);
        await asset.downloadAsync(); // Ensures the file is available locally
        
        if (!(await Sharing.isAvailableAsync())) {
          alert("Sharing is not available on this device.");
          return;
        }
        
        // Extract the original filename from the path
        const originalPath = asset.localUri || asset.uri;
        const fileName = title ? `${title}.pdf` : originalPath.split('/').pop();
        
        // Create a temporary file with the correct name
        const fileInfo = await FileSystem.getInfoAsync(originalPath);
        const tempFilePath = `${FileSystem.cacheDirectory}${fileName}`;
        
        // Copy the file to ensure the correct filename
        await FileSystem.copyAsync({
          from: originalPath,
          to: tempFilePath
        });
        
        await Sharing.shareAsync(tempFilePath, {
          mimeType: "application/pdf",
          dialogTitle: "Share PDF",
          UTI: "com.adobe.pdf", // Ensures the file is treated as a PDF
        });
        
        // Clean up the temporary file
        await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
      } catch (error) {
        alert("Sharing failed: " + error.message);
      }
    };
    
    

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.iconContainer}>
            {pdfAsset && (
              <TouchableOpacity onPress={handlePrint} style={styles.iconButton}>
                <Ionicons name="print-outline" size={24} color="#000" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    );
  };

  // Create a flat list of cards based on the search query
  const lowerSearch = searchText.trim().toLowerCase();
  let searchResults = [];
  if (lowerSearch) {
    Object.keys(forms).forEach((groupName) => {
      forms[groupName].forEach((card) => {
        if (
          card.title.toLowerCase().includes(lowerSearch) ||
          card.description.toLowerCase().includes(lowerSearch) ||
          groupName.toLowerCase().includes(lowerSearch)
        ) {
          searchResults.push(card);
        }
      });
    });
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={24}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#666"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText !== "" && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        {lowerSearch
          ? // Flat list of cards when searching
            searchResults.map((card, index) => <Card key={index} {...card} />)
          : // Grouped view when not searching
            Object.keys(forms).map((groupName) => (
              <View key={groupName} style={styles.groupContainer}>
                <TouchableOpacity
                  style={styles.groupHeader}
                  onPress={() => toggleGroup(groupName)}
                >
                  <Text style={styles.groupTitle}>{groupName}</Text>
                  <Ionicons
                    name={
                      expandedGroups[groupName]
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
                {expandedGroups[groupName] && (
                  <View style={styles.cardsContainer}>
                    {forms[groupName].map((card, index) => (
                      <Card key={index} {...card} />
                    ))}
                  </View>
                )}
              </View>
            ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  groupContainer: {
    marginBottom: 24,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardsContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    flexWrap: "wrap",
    marginRight: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
});
