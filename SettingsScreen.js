import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { generateHtml } from './HtmlGenerator';
import {
  DEFAULT_LAYOUT,
  SLIDER_RANGES,
  COLOR_PRESETS,
  sliderToValue,
  valueToSlider,
} from './config/layoutConfig';

const SAMPLE_DATA = {
  image: { base64: '', uri: null },
  name: 'Marko',
  surname: 'Markovic',
  settedValues: [
    'Musko',
    'Nakon krace bolesti',
    '75',
    '1950',
    '01.01.2025',
    'iz kapele',
    '03.01.2025',
    '14:00',
    'Gradsko groblje',
    'Supruga Mara, sin Petar, kcerka Ana',
  ],
};

const SCREEN_WIDTH = Dimensions.get('window').width;

const SECTIONS = [
  {
    title: 'Krst',
    key: 'cross',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'crossTop' },
      { label: 'Lijevo/Desno', layoutKey: 'crossLeft' },
      { label: 'Velicina', layoutKey: 'crossScale' },
    ],
  },
  {
    title: 'Lisce',
    key: 'leafs',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'leafsTop' },
      { label: 'Lijevo/Desno', layoutKey: 'leafsLeft' },
      { label: 'Velicina', layoutKey: 'leafsScale' },
    ],
  },
  {
    title: 'Slika',
    key: 'image',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'imageTop' },
      { label: 'Lijevo/Desno', layoutKey: 'imageLeft' },
      { label: 'Sirina', layoutKey: 'imageWidth' },
      { label: 'Visina', layoutKey: 'imageHeight' },
    ],
  },
  {
    title: 'Godine',
    key: 'years',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'yearsTop' },
      { label: 'Lijevo/Desno', layoutKey: 'yearsLeft' },
      { label: 'Font', layoutKey: 'yearsFontSize' },
    ],
  },
  {
    title: 'Tekst "Rodbini..."',
    key: 'lightText',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'lightTextTop' },
      { label: 'Lijevo/Desno', layoutKey: 'lightTextLeft' },
      { label: 'Font', layoutKey: 'lightTextFontSize' },
    ],
  },
  {
    title: 'Ime i Prezime',
    key: 'name',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'nameTop' },
      { label: 'Lijevo/Desno', layoutKey: 'nameLeft' },
      { label: 'Font', layoutKey: 'nameFontSize' },
    ],
  },
  {
    title: 'Glavni Tekst',
    key: 'bolded',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'boldedTop' },
      { label: 'Lijevo/Desno', layoutKey: 'boldedLeft' },
      { label: 'Font', layoutKey: 'boldedFontSize' },
    ],
  },
  {
    title: 'Mourning Ornament',
    key: 'mourning',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'mourningTop' },
      { label: 'Lijevo/Desno', layoutKey: 'mourningLeft' },
      { label: 'Velicina', layoutKey: 'mourningScale' },
    ],
  },
  {
    title: '"Ozalosceni" Tekst',
    key: 'mourningTitle',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'mourningTitleTop' },
      { label: 'Lijevo/Desno', layoutKey: 'mourningTitleLeft' },
      { label: 'Font', layoutKey: 'mourningFontSize' },
    ],
  },
  {
    title: 'Sadrzaj Ozalosceni',
    key: 'mourningContent',
    controls: [
      { label: 'Gore/Dole', layoutKey: 'mourningContentTop' },
      { label: 'Lijevo/Desno', layoutKey: 'mourningContentLeft' },
      { label: 'Font', layoutKey: 'mourningContentFontSize' },
    ],
  },
  {
    title: 'Boje',
    key: 'colors',
    colorControls: [
      { label: 'Boja teksta', layoutKey: 'textColor' },
      { label: 'Boja imena', layoutKey: 'nameColor' },
      { label: 'Okvir slike', layoutKey: 'borderColor' },
      { label: 'Boja krsta', layoutKey: 'crossColor' },
    ],
  },
];

export default function SettingsScreen({ navigation, route }) {
  const isSetupMode = route?.params?.mode === 'setup';

  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState(
    isSetupMode ? { cross: true } : {}
  );
  const [previewHtml, setPreviewHtml] = useState('');
  const [zoom, setZoom] = useState(1.0);
  const previewTimer = useRef(null);

  const previewData = route?.params?.previewData || null;

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isSetupMode) return;
    const onBackPress = () => {
      Alert.alert(
        'Podesavanje u toku',
        'Molimo zavrsите pocetno podesavanje prije koriscenja aplikacije.',
        [{ text: 'U redu' }]
      );
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isSetupMode]);

  useEffect(() => {
    updatePreview(layout, zoom);
  }, [layout, zoom]);

  const updatePreview = useCallback((currentLayout, currentZoom) => {
    if (previewTimer.current) {
      clearTimeout(previewTimer.current);
    }
    previewTimer.current = setTimeout(() => {
      const data = previewData || SAMPLE_DATA;
      const img = data.image && data.image.base64
        ? data.image
        : { base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' };
      const settedValues = (data.settedValues || SAMPLE_DATA.settedValues).map(
        (val, i) => (val && val.trim() !== '' ? val : SAMPLE_DATA.settedValues[i])
      );
      let html = generateHtml(
        img,
        data.name || 'Marko',
        data.surname || 'Markovic',
        settedValues,
        currentLayout
      );
      const previewPadding = 16;
      const availableWidth = SCREEN_WIDTH - previewPadding * 2;
      const previewHeight = 220;
      const availableHeight = previewHeight - previewPadding * 2;
      const baseScale = Math.min(availableWidth / 792, availableHeight / 612);
      const scale = baseScale * (currentZoom || 1);
      html = html.replace(
        '</style>',
        `
        html.preview-mode {
          width: 100%;
          height: 100%;
          background: #8e8e8e !important;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden !important;
        }
        html.preview-mode body {
          width: 792pt !important;
          height: 612pt !important;
          transform: scale(${scale.toFixed(4)});
          transform-origin: center center;
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.35);
          border: 1px solid #999;
          background: #fff !important;
        }
        </style>`
      ).replace('<html>', '<html class="preview-mode">');
      setPreviewHtml(html);
    }, 300);
  }, [previewData]);

  const loadSettings = async () => {
    try {
      const savedLayout = await AsyncStorage.getItem('layoutSettings');
      if (savedLayout) {
        const parsed = JSON.parse(savedLayout);
        const isOldFormat = parsed.crossColor === undefined;
        if (isOldFormat) {
          setLayout({ ...DEFAULT_LAYOUT });
          return;
        }
        setLayout({ ...DEFAULT_LAYOUT, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('layoutSettings', JSON.stringify(layout));
      if (isSetupMode) {
        await AsyncStorage.setItem('onboardingComplete', 'true');
        Alert.alert(
          'Podesavanje zavrseno!',
          'Izgled dokumenta je sacuvan. Mozete poceti sa koriscenjem aplikacije.',
          [{ text: 'OK', onPress: () => navigation.replace('Home') }]
        );
      } else {
        setHasChanges(false);
        Alert.alert(
          'Sacuvano!',
          'Postavke layout-a su uspjesno sacuvane.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert('Greska', 'Greska pri cuvanju postavki.');
    }
  };

  const resetToDefault = () => {
    Alert.alert(
      'Vracanje na default',
      'Da li zelite vratiti sve postavke na pocetne vrijednosti?',
      [
        { text: 'Odustani', style: 'cancel' },
        {
          text: 'Vrati',
          style: 'destructive',
          onPress: () => {
            setLayout({ ...DEFAULT_LAYOUT });
            setHasChanges(true);
          },
        },
      ]
    );
  };

  const updateValue = (key, value) => {
    setLayout((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const SliderControl = ({ label, layoutKey, value }) => {
    const range = SLIDER_RANGES[layoutKey];
    const sliderVal = valueToSlider(value, layoutKey);
    const displayValue = range.step && range.step < 1
      ? value.toFixed(2)
      : Math.round(value);

    const [inputValue, setInputValue] = useState(displayValue.toString());
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      if (!isEditing) {
        setInputValue(displayValue.toString());
      }
    }, [displayValue, isEditing]);

    const handleInputChange = (text) => {
      setInputValue(text);
    };

    const handleInputSubmit = () => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        // Ograniči vrednost na min/max range
        const clampedValue = Math.max(range.min, Math.min(range.max, numValue));
        updateValue(layoutKey, clampedValue);
        setInputValue(clampedValue.toString());
      } else {
        // Ako nije validan broj, vrati na prethodnu vrednost
        setInputValue(displayValue.toString());
      }
      setIsEditing(false);
    };

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.valueInputContainer}>
            <TextInput
              style={styles.valueInput}
              value={inputValue}
              onChangeText={handleInputChange}
              onFocus={() => setIsEditing(true)}
              onBlur={handleInputSubmit}
              onSubmitEditing={handleInputSubmit}
              keyboardType="numeric"
              returnKeyType="done"
              selectTextOnFocus
            />
          </View>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={0.1}
          value={sliderVal}
          onValueChange={(val) => {
            const newValue = sliderToValue(val, layoutKey);
            updateValue(layoutKey, newValue);
          }}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#2196F3"
        />
      </View>
    );
  };

  const ColorControl = ({ label, layoutKey, value }) => {
    return (
      <View style={styles.colorControlContainer}>
        <Text style={styles.colorLabel}>{label}</Text>
        <View style={styles.colorGrid}>
          {COLOR_PRESETS.map((color) => (
            <TouchableOpacity
              key={`${layoutKey}-${color}`}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                value === color && styles.colorSwatchSelected,
              ]}
              onPress={() => updateValue(layoutKey, color)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections[section.key];

    return (
      <View key={section.key} style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.key)}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionArrow}>
            {isExpanded ? '\u25B2' : '\u25BC'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {section.controls &&
              section.controls.map((ctrl) => (
                <SliderControl
                  key={ctrl.layoutKey}
                  label={ctrl.label}
                  layoutKey={ctrl.layoutKey}
                  value={layout[ctrl.layoutKey]}
                />
              ))}
            {section.colorControls &&
              section.colorControls.map((ctrl) => (
                <ColorControl
                  key={ctrl.layoutKey}
                  label={ctrl.label}
                  layoutKey={ctrl.layoutKey}
                  value={layout[ctrl.layoutKey]}
                />
              ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {isSetupMode ? (
          <View style={{ width: 60 }} />
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{'\u2190'} Nazad</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {isSetupMode ? 'Pocetno podesavanje' : 'Podesavanje'}
        </Text>
        {isSetupMode ? (
          <Text style={styles.stepIndicator}>Korak 2/2</Text>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {previewHtml ? (
        <View style={styles.previewContainer}>
          <WebView
            source={{ html: previewHtml }}
            style={styles.preview}
            scrollEnabled={false}
            originWhitelist={['*']}
            javaScriptEnabled={false}
          />
          <View style={styles.zoomBar}>
            <Text style={styles.zoomLabel}>Zoom</Text>
            <Slider
              style={styles.zoomSlider}
              minimumValue={1}
              maximumValue={3}
              step={0.1}
              value={zoom}
              onValueChange={setZoom}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#fff"
            />
            <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>
          </View>
        </View>
      ) : null}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isSetupMode && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              Koristite klizace ispod da prilagodite poziciju i velicinu elemenata na dokumentu. Promjene se odmah prikazuju u pregledu iznad.
            </Text>
          </View>
        )}
        {SECTIONS.map(renderSection)}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        {(isSetupMode || hasChanges) && (
          <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
            <Text style={styles.saveButtonText}>
              {isSetupMode ? 'Sacuvaj i nastavi' : 'Sacuvaj Promjene'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefault}>
          <Text style={styles.resetButtonText}>Vrati na Default</Text>
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
  stepIndicator: {
    fontSize: 13,
    color: '#2196F3',
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  infoBanner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  infoBannerText: {
    fontSize: 13,
    color: '#1565c0',
    lineHeight: 18,
  },
  previewContainer: {
    height: 260,
    backgroundColor: '#8e8e8e',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  preview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  zoomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  zoomLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    width: 38,
  },
  zoomSlider: {
    flex: 1,
    height: 28,
  },
  zoomValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    width: 32,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionContainer: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  sectionArrow: {
    fontSize: 12,
    color: '#999',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sliderContainer: {
    marginTop: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  valueInputContainer: {
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 70,
  },
  valueInput: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorControlContainer: {
    marginTop: 16,
  },
  colorLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 10,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#2196F3',
    borderWidth: 3,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
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
