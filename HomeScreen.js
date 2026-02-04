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
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useRef, useEffect, useCallback } from "react";
import Stepper from "./components/Stepper";
import Header from "./components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Print from "expo-print";
import data from "./json_exports/stepperData.json";

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState({ uri: null, base64: null });
  const [stepperList, setStepperList] = useState(data);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [focused, setFocused] = useState(1);
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef();
  const [layoutSettings, setLayoutSettings] = useState(null);

  useEffect(() => {
    loadLayoutSettings();
  }, []);

  const loadLayoutSettings = async () => {
    try {
      const savedLayout = await AsyncStorage.getItem('layoutSettings');
      if (savedLayout) {
        setLayoutSettings(JSON.parse(savedLayout));
      }
    } catch (error) {
      console.error('Error loading layout settings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLayoutSettings();
    }, [])
  );

  const clearStates = () => {
    Alert.alert(
      "Poništavanje",
      "Da li ste sigurni da želite da poništite sve unesene podatke?",
      [
        {
          text: "Odustani",
          style: "cancel",
        },
        {
          text: "Potvrdi",
          onPress: () => {
            setStepperList(data);
            setName("");
            setSurname("");
            setFocused(1);
            setImage({ uri: null, base64: null });
            scrollToTop();
          },
          style: "destructive",
        },
      ]
    );
  };

  const showAlert = (label) => {
    Alert.alert(
      "Potrebno je unijeti sva polja!",
      `Provjerite polje: ${label}`,
      [
        {
          text: "OK",
          style: "default",
        },
      ]
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

  const validateAllFields = () => {
    if (!name.trim()) {
      showAlert("Ime");
      return false;
    }
    if (!surname.trim()) {
      showAlert("Prezime");
      return false;
    }
    if (!image.uri || !image.base64) {
      showAlert("Slika");
      return false;
    }

    const settedValues = extractSettedValues(stepperList);
    for (let i = 0; i < settedValues.length; i++) {
      if (!settedValues[i] || settedValues[i].trim() === "") {
        showAlert(stepperList[i].title);
        setFocused(i + 1);
        return false;
      }
    }

    return true;
  };

  const print = async () => {
    if (!validateAllFields()) {
      return;
    }

    setIsGenerating(true);
    
    try {
      const settedValues = extractSettedValues(stepperList);
      const html = generateHtml(image, name, surname, settedValues, layoutSettings);
      
      await Print.printAsync({
        html,
        printerUrl: selectedPrinter?.url,
        orientation: Print.Orientation.landscape,
      });

      Alert.alert(
        "Uspješno!",
        "Dokument je kreiran.",
        [
          {
            text: "Novi dokument",
            onPress: () => {
              clearStates();
            },
          },
          {
            text: "Zatvori",
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert(
        "Greška",
        "Došlo je do greške pri kreiranju dokumenta. Molimo pokušajte ponovo.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const getTotalProgress = () => {
    let completed = 0;
    if (name && surname && image.uri) completed += 1;
    
    stepperList.forEach((item) => {
      if (item.settedValue && item.settedValue.trim() !== "") {
        completed += 1;
      }
    });

    return Math.round((completed / (stepperList.length + 1)) * 100);
  };

  const progress = getTotalProgress();

  return (
    <ActionSheetProvider>
      <>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.body} 
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
          >
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraScrollHeight={20}
            >
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Napredak: {progress}%
                </Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>
              </View>

              <Header
                name={name}
                surname={surname}
                setName={setName}
                setSurname={setSurname}
                image={image}
                setImage={setImage}
              />

              <View style={styles.stepperContainer}>
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

                <View style={styles.actionContainer}>
                  {focused === 11 ? (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.btn,
                          styles.createBtn,
                          isGenerating && styles.btnDisabled,
                        ]}
                        onPress={print}
                        disabled={isGenerating}
                      >
                        <Text style={styles.btnText}>
                          {isGenerating ? "KREIRANJE..." : "📄 KREIRAJ DOKUMENT"}
                        </Text>
                      </TouchableOpacity>
                      
                      {/* DVA DUGMETA JEDNO PORED DRUGOG */}
                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[styles.btn, styles.halfBtn, styles.backBtn]}
                          onPress={() => setFocused(focused - 1)}
                          disabled={isGenerating}
                        >
                          <Text style={styles.btnText}>NAZAD</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.btn, styles.halfBtn, styles.settingsBtn]}
                          onPress={() => navigation.navigate('Settings')}
                        >
                          <Text style={styles.settingsBtnText}>⚙️</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btn, styles.cancelBtn]}
                      onPress={clearStates}
                    >
                      <Text style={styles.btnText}>🗑️ PONIŠTI SVE</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </KeyboardAwareScrollView>
          </ScrollView>
        </SafeAreaView>
      </>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  body: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  stepperContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  actionContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  halfBtn: {
    flex: 1,
    maxWidth: undefined, 
    paddingVertical: 8,     // ← SMANJEN sa 14 na 10
    paddingHorizontal: 15,   // ← SMANJEN sa 30 na 15
    alignItems:'center', justifyContent:'center'
  },
  createBtn: {
    backgroundColor: "rgb(33, 150, 243)",
  },
  backBtn: {
    backgroundColor: "#666",
  },
  settingsBtn: {
    backgroundColor: '#2196F3',
  },
  settingsBtnText: {
    fontSize: 24,
    color: 'white',
  },
  cancelBtn: {
    backgroundColor: "rgb(245, 33, 33)",
  },
  btnDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
}); 