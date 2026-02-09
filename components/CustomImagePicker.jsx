import React, { useCallback, useState, useRef } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { useActionSheet } from "@expo/react-native-action-sheet";

const CustomImagePicker = ({ image, setImage }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const { showActionSheetWithOptions } = useActionSheet();

  const getCameraPermission = async () => {
    const result = await requestPermission();
    return result.granted;
  };

  const onPress = async () => {
    const options = ["Kamera", "Galerija", "Odustani"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            const hasPermission = await getCameraPermission();
            if (hasPermission) {
              setShowCamera(true);
            } else {
              alert("Molimo dozvolite pristup kameri u postavkama.");
            }
            break;

          case 1:
            // Delay to let the action sheet fully dismiss on Android
            setTimeout(() => imagePicker(), 500);
            break;

          default:
            break;
        }
      }
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        const base64Image = await convertImageToBase64(photo.uri);
        setImage({ uri: photo.uri, base64: base64Image });
        setShowCamera(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        alert("Greška pri snimanju fotografije.");
      }
    }
  };

  const imagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.status !== 'granted') {
        alert("Molimo dozvolite pristup galeriji u postavkama.");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        const base64Image = await convertImageToBase64(result.assets[0].uri);
        setImage({ uri: result.assets[0].uri, base64: base64Image });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Greška pri izboru slike.");
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // Resize for better performance
        {
          base64: true,
          compress: 0.8,
        }
      );
      return manipulatedImage.base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const removePicture = useCallback(() => {
    setImage({ uri: null, base64: null });
  }, [setImage]);

  const flipCamera = () => {
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  return (
    <View style={styles.container}>
      {image.uri ? (
        <>
          <Image source={{ uri: image.uri }} style={styles.images} />
          <TouchableOpacity onPress={removePicture} style={styles.removeButton}>
            <Text style={styles.removeText}>Ukloni</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={onPress}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>📷</Text>
              <Text style={styles.addText}>Dodaj sliku</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <>
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
              />
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.controlText}>✕ Zatvori</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={flipCamera}
                >
                  <Text style={styles.controlText}>🔄 Okreni</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>
                Potrebna je dozvola za pristup kameri
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={getCameraPermission}
              >
                <Text style={styles.permissionButtonText}>Dozvoli pristup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  images: {
    width: 120,
    height: 150,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  placeholderContainer: {
    width: 120,
    height: 150,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  placeholderText: {
    fontSize: 40,
    marginBottom: 8,
  },
  addText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  removeButton: {
    marginTop: 8,
    padding: 4,
  },
  removeText: {
    textAlign: "center",
    color: "rgb(245, 33, 33)",
    fontSize: 12,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    paddingBottom: 40,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8,
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8,
  },
  controlText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "rgb(33, 150, 243)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomImagePicker;
