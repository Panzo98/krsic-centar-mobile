import { View, TextInput, StyleSheet } from "react-native";
import React from "react";

const CustomTextInput = ({ placeholder, value, setValue }) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8c8c8c"
        value={value}
        onChangeText={(e) => setValue(e)}
      ></TextInput>
      <View style={styles.borderBottom} />
    </View>
  );
};

const styles = new StyleSheet.create({
  input: {
    height: 40,
    borderBottomWidth: 0,
    paddingHorizontal: 5,
  },
  borderBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
});

export default CustomTextInput;
