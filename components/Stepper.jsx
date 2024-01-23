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
  }, [stepperList]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 25,
        marginRight: 40,
      }}
    >
      <View>
        <View
          style={[
            styles.numberShell,
            {
              backgroundColor:
                focused < step
                  ? "black"
                  : focused === step
                  ? "rgb(33, 150, 243)"
                  : "green",
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => (focused > step ? setFocused(step) : null)}
          >
            <Text style={styles.number}>{step}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flex: focused ? 1 : "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "gray",
              marginTop: 13,
              width: 1,
            }}
          ></View>
        </View>
      </View>
      <View style={{ paddingLeft: 8 }}>
        <Text style={styles.title}>{label}</Text>
        <Text style={{ fontWeight: "300", fontSize: 12 }}>{sublabel}</Text>
        <View style={{ marginTop: 15 }}>
          {selectable ? (
            <SelectDropdown
              disabled={focused === step ? false : true}
              data={selectable}
              defaultButtonText="Izaberi"
              onSelect={(e) => {
                handleEditSetValue(e);
              }}
              value={settedValue}
              buttonStyle={{
                height: "auto",
                paddingVertical: 8,
                backgroundColor:
                  focused > step
                    ? "green"
                    : focused < step
                    ? "rgb(223,223,223)"
                    : "rgb(33, 150, 243)",
              }}
              buttonTextStyle={{
                color: focused < step ? "black" : "white",
                fontSize: 14,
              }}
            />
          ) : (
            <TextInput
              placeholder="Unesite vrijednosti"
              multiline
              placeholderTextColor="#8c8c8c"
              value={settedValue}
              onChangeText={(e) => handleEditSetValue(e)}
              editable={focused === step ? true : false}
            ></TextInput>
          )}
        </View>
        {focused === step ? (
          <View
            style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "rgb(33, 150, 243)" }]}
              onPress={() =>
                settedValue === "" ? showAlert() : setFocused(focused + 1)
              }
            >
              <Text style={styles.btnColor}>DALJE</Text>
            </TouchableOpacity>
            {focused > 1 ? (
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: "rgb(245, 33, 33)", marginLeft: 10 },
                ]}
                onPress={() => {
                  if (focused > 1) {
                    setFocused(focused - 1);
                    // SelectDropdown.reset();
                  }
                }}
              >
                <Text style={styles.btnColor}>NAZAD</Text>
              </TouchableOpacity>
            ) : (
              ""
            )}
          </View>
        ) : (
          ""
        )}
        {/* <View style={{display: focused ? 'flex' : 'none'}}></View> */}
      </View>
    </View>
  );
}

const styles = new StyleSheet.create({
  numberShell: {
    borderRadius: 100,
    height: 35,
    width: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  btnColor: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
});
