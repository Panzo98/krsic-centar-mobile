import { View, StyleSheet } from "react-native";
import CustomImagePicker from "./CustomImagePicker";
import CustomTextInput from "./CustomTextInput";
import React from "react";

export default function Header({
  name,
  surname,
  setName,
  setSurname,
  image,
  setImage,
}) {
  return (
    <View style={styles.headerSection}>
      <View>
        <CustomImagePicker image={image} setImage={setImage} />
      </View>
      <View style={styles.nameSection}>
        <CustomTextInput placeholder={"IME"} value={name} setValue={setName} />
        <CustomTextInput
          placeholder={"PREZIME"}
          value={surname}
          setValue={setSurname}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    display: "flex",
    flexDirection: "row",
  },
  nameSection: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
    paddingLeft: 20,
  },
});
