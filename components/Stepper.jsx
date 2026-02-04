import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useMemo } from "react";
import SelectDropdown from "react-native-select-dropdown";

export default function Stepper({
  step,
  label,
  sublabel,
  focused,
  setFocused,
  selectable,
  settedValue,
  stepperList,
  setStepperList,
}) {
  const showAlert = () => {
    Alert.alert(
      "Potrebno je unijeti sva polja!",
      `Polje ${label} niste unijeli!`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const handleEditSetValue = useMemo(() => {
    return (e) => {
      let newList = stepperList.map((elem) => {
        if (elem.id === step) {
          return { ...elem, settedValue: e };
        } else {
          return elem;
        }
      });
      setStepperList(newList);
    };
  }, [stepperList, step, setStepperList]);

  const isCompleted = focused > step;
  const isActive = focused === step;
  const isPending = focused < step;

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <TouchableOpacity
          style={[
            styles.numberShell,
            {
              backgroundColor: isPending
                ? "#666"
                : isActive
                ? "rgb(33, 150, 243)"
                : "#22c55e",
            },
          ]}
          onPress={() => (isCompleted ? setFocused(step) : null)}
          activeOpacity={isCompleted ? 0.6 : 1}
        >
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <Text style={styles.number}>{step}</Text>
          )}
        </TouchableOpacity>
        
        {step < 10 && (
          <View style={styles.connector}>
            <View
              style={[
                styles.connectorLine,
                { backgroundColor: isCompleted ? "#22c55e" : "#ccc" },
              ]}
            />
          </View>
        )}
      </View>

      <View style={styles.contentColumn}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.subtitle}>{sublabel}</Text>
        
        {settedValue && !isActive && (
          <Text style={styles.previewText} numberOfLines={2}>
            {settedValue}
          </Text>
        )}

        {isActive && (
          <View style={styles.inputContainer}>
            {selectable ? (
              <SelectDropdown
                data={selectable}
                defaultButtonText={"Izaberi opciju"}
                onSelect={(e) => {
                  handleEditSetValue(e);
                }}
                defaultValue={settedValue}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
                rowStyle={styles.dropdownRow}
                rowTextStyle={styles.dropdownRowText}
                dropdownStyle={styles.dropdown}
              />
            ) : (
              <TextInput
                placeholder="Unesite vrijednost"
                multiline={step === 10}
                numberOfLines={step === 10 ? 4 : 1}
                placeholderTextColor="#999"
                value={settedValue}
                onChangeText={(e) => handleEditSetValue(e)}
                style={[
                  styles.textInput,
                  step === 10 && styles.textInputMultiline,
                ]}
                onSubmitEditing={() =>
                  settedValue === "" ? showAlert() : setFocused(focused + 1)
                }
                returnKeyType={step === 10 ? "default" : "next"}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.nextButton]}
                onPress={() =>
                  settedValue === "" ? showAlert() : setFocused(focused + 1)
                }
              >
                <Text style={styles.buttonText}>DALJE →</Text>
              </TouchableOpacity>

              {focused > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.backButton]}
                  onPress={() => setFocused(focused - 1)}
                >
                  <Text style={styles.buttonText}>← NAZAD</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 30,
    marginRight: 20,
  },
  leftColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  numberShell: {
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  number: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  checkmark: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  connector: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
  },
  contentColumn: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  previewText: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    fontSize: 14,
    color: "#333",
    borderLeftWidth: 3,
    borderLeftColor: "#22c55e",
  },
  inputContainer: {
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dropdownButton: {
    width: "100%",
    height: 45,
    backgroundColor: "rgb(33, 150, 243)",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdownButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "left",
  },
  dropdown: {
    borderRadius: 8,
    marginTop: -20,
  },
  dropdownRow: {
    paddingVertical: 12,
    borderBottomColor: "#f0f0f0",
  },
  dropdownRowText: {
    fontSize: 15,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nextButton: {
    backgroundColor: "rgb(33, 150, 243)",
    flex: 1,
  },
  backButton: {
    backgroundColor: "#666",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
