import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_LAYOUT = {
  crossTop: -218,
  crossLeft: 442,
  imageTop: 140,
  imageLeft: 30,
  yearsTop: -50,
  lightTextMarginTop: 8,
  nameTop: 17,
  boldedMarginTop: 15,
  mourningTop: 240,
  mourningLeft: 366,
  mourningTextMarginTop: 20,
  ozalosceniLeft: -116,
};

export default function SettingsScreen({ navigation }) {
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLayout = await AsyncStorage.getItem('layoutSettings');
      if (savedLayout) {
        setLayout(JSON.parse(savedLayout));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('layoutSettings', JSON.stringify(layout));
      setHasChanges(false);
      Alert.alert(
        'Sačuvano!',
        'Postavke layout-a su uspješno sačuvane.',
        [{ text: 'OK',onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Greška', 'Greška pri čuvanju postavki.');
    }
  };

  const resetToDefault = () => {
    Alert.alert(
      'Vraćanje na default',
      'Da li želite vratiti sve postavke na početne vrijednosti?',
      [
        { text: 'Odustani', style: 'cancel' },
        {
          text: 'Vrati',
          style: 'destructive',
          onPress: () => {
            setLayout(DEFAULT_LAYOUT);
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const updateValue = (key, value) => {
    setLayout({ ...layout, [key]: value });
    setHasChanges(true);
  };

  const SliderControl = ({ label, value, min, max, step, onChange }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step || 1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#2196F3"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Nazad</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Postavke Layout-a</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>⛪ Krst</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.crossTop}
          min={-600}
          max={500}
          onChange={(val) => updateValue('crossTop', val)}
        />
        <SliderControl
          label="Pozicija Lijevo/Desno"
          value={layout.crossLeft}
          min={300}
          max={600}
          onChange={(val) => updateValue('crossLeft', val)}
        />

        <Text style={styles.sectionTitle}>🖼️ Slika</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.imageTop}
          min={-500}
          max={500}
          onChange={(val) => updateValue('imageTop', val)}
        />
        <SliderControl
          label="Pozicija Lijevo/Desno"
          value={layout.imageLeft}
          min={-500}
          max={500}
          onChange={(val) => updateValue('imageLeft', val)}
        />

        <Text style={styles.sectionTitle}>📅 Godine (1945. - 2026.)</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.yearsTop}
          min={-500}
          max={500}
          onChange={(val) => updateValue('yearsTop', val)}
        />

        <Text style={styles.sectionTitle}>📝 Tekst "Родбини..."</Text>
        <SliderControl
          label="Razmak Gore"
          value={layout.lightTextMarginTop}
          min={0}
          max={30}
          onChange={(val) => updateValue('lightTextMarginTop', val)}
        />

        <Text style={styles.sectionTitle}>👤 Ime i Prezime</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.nameTop}
          min={-20}
          max={40}
          onChange={(val) => updateValue('nameTop', val)}
        />

        <Text style={styles.sectionTitle}>📄 Glavni Tekst</Text>
        <SliderControl
          label="Razmak Gore"
          value={layout.boldedMarginTop}
          min={5}
          max={30}
          onChange={(val) => updateValue('boldedMarginTop', val)}
        />

        <Text style={styles.sectionTitle}>🌸 Ožalošćeni Simbol</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.mourningTop}
          min={180}
          max={300}
          onChange={(val) => updateValue('mourningTop', val)}
        />
        <SliderControl
          label="Pozicija Lijevo/Desno"
          value={layout.mourningLeft}
          min={250}
          max={450}
          onChange={(val) => updateValue('mourningLeft', val)}
        />

        <Text style={styles.sectionTitle}>💐 "Ožalošćeni" Tekst</Text>
        <SliderControl
          label="Razmak Gore"
          value={layout.mourningTextMarginTop}
          min={10}
          max={40}
          onChange={(val) => updateValue('mourningTextMarginTop', val)}
        />

        <Text style={styles.sectionTitle}>🍃 Lišće (ornamenti)</Text>
        <SliderControl
          label="Pozicija Gore/Dole"
          value={layout.ozalosceniLeft}
          min={-200}
          max={-50}
          onChange={(val) => updateValue('ozalosceniLeft', val)}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        {hasChanges && (
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Text style={styles.saveButtonText}>💾 Sačuvaj Promjene</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefault}>
          <Text style={styles.resetButtonText}>🔄 Vrati na Default</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 25,
    marginBottom: 10,
  },
  sliderContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
