import React, { useCallback, useState } from "react";
import { Camera } from "expo-camera";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";
import { useActionSheet } from "@expo/react-native-action-sheet";

const CustomImagePicker = ({ image, setImage }) => {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const { showActionSheetWithOptions } = useActionSheet();
  const [cameraPermission, setCameraPermission] = useState(null);

  const getCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === "granted");
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
            await getCameraPermission();
            if (cameraPermission) {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }
            break;

          case 1:
            await imagePicker();
            break;

          default:
            break;
        }
      }
    );
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      console.log(photo);
    }
  };

  const imagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setImage({ uri: result.assets[0].uri, base64: base64Image });
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const manipulatedImage = await manipulateAsync(imageUri, [], {
        base64: true,
      });
      return manipulatedImage.base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const removePicture = useCallback(() => {
    setImage({ uri: null, base64: null });
  }, []);

  return (
    <View>
      {image.uri ? (
        <>
          <Image source={{ uri: image.uri }} style={styles.images} />
          <TouchableOpacity onPress={removePicture}>
            <Text
              style={{
                textAlign: "center",
                color: "red",
                fontSize: 12,
                marginTop: 3,
              }}
            >
              Ukloni
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={onPress}>
            <Image
              source={require("../assets/galeryImages2.png")}
              style={styles.images}
            />
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            Dodaj sliku
          </Text>
        </>
      )}
    </View>
  );
};

const styles = {
  images: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderRadius: 3,
  },
};

export default CustomImagePicker;
