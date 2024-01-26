import { StatusBar } from "expo-status-bar";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { generateHtml } from "./HtmlGenerator";
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState, useRef } from "react";
import Stepper from "./components/Stepper";
import Header from "./components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Print from "expo-print";
import data from "./assets/stepperData.json";

export default function App() {
  const [image, setImage] = useState({ uri: null, base64: null });
  const [stepperList, setStepperList] = useState(data);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [focused, setFocused] = useState(1);
  const [selectedPrinter, setSelectedPrinter] = useState();
  const scrollRef = useRef();

  const clearStates = () => {
    setStepperList(data);
    setName("");
    setSurname("");
    setFocused(1);
    setImage({ uri: null, base64: null });
  };

  const showAlert = (label) => {
    Alert.alert(
      "Potrebno je unijeti sva polja!",
      `Polje ${label} provjerite!`,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
          style: "default",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };
  const extractSettedValues = (dataArray) => {
    return dataArray.map((item) => item.settedValue);
  };

  const print = async () => {
    const settedValues = extractSettedValues(stepperList);
    const html = generateHtml(image, name, surname, settedValues);
    console.log(settedValues);
    try {
      await Print.printAsync({
        html,
        printerUrl: selectedPrinter?.url,
        orientation: "landscape",
      });
    } catch (error) {}
  };

  return (
    <ActionSheetProvider>
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView style={styles.body} ref={scrollRef}>
            <KeyboardAwareScrollView>
              <Header
                name={name}
                surname={surname}
                setName={setName}
                setSurname={setSurname}
                image={image}
                setImage={setImage}
              />
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  paddingTop: 30,
                }}
              >
                {stepperList.map((elem, key) => (
                  <Stepper
                    key={key}
                    step={elem.id}
                    label={elem.title}
                    sublabel={elem.subtitle}
                    focused={focused}
                    settedValue={elem.settedValue}
                    setFocused={setFocused}
                    selectable={elem.selectable}
                    stepperList={stepperList}
                    setStepperList={setStepperList}
                  />
                ))}
                {focused === 10 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        { backgroundColor: "rgb(33, 150, 243)" },
                      ]}
                      onPress={() => {
                        if (name === "" || surname === "" || image === "") {
                          showAlert("IME, PREZIME, SLIKA");
                        } else {
                          print();
                        }
                      }}
                    >
                      <Text style={styles.btnText}>KREIRAJ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        {
                          backgroundColor: "rgb(245, 33, 33)",
                          marginBottom: 100,
                        },
                      ]}
                      onPress={() => setFocused(focused - 1)}
                    >
                      <Text style={styles.btnText}>NAZAD</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.btn,
                        {
                          backgroundColor: "rgb(245, 33, 33)",
                          marginBottom: 100,
                        },
                      ]}
                      onPress={() => {
                        clearStates();
                        scrollToTop();
                      }}
                    >
                      <Text style={styles.btnText}>PONISTI</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </SafeAreaView>
      </>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  body: {
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 90,
  },
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
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 3,
    width: 110,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },
});
