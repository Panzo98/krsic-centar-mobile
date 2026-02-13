// Centralizovana konfiguracija za PDF layout

// PDF dimenzije u pt (Letter landscape: 11 x 8.5 inča = 792 x 612 pt)
export const PDF_DIMENSIONS = {
  width: 792,
  height: 612,
  unit: 'pt'
};

// Default vrijednosti za layout
// SVG i tekst pozicije su OFFSETI od originalne pozicije (0 = originalna pozicija)
// Slika je direktna apsolutna pozicija
export const DEFAULT_LAYOUT = {
  // Krst - offset od baze (baza: calc(50% - 210px), 350px)
  crossTop: -210,
  crossLeft: 67,
  crossScale: 1.0,
  crossColor: '#000000',
  // Lišće - offset od baze (baza: calc(50% - 120px), 330px)
  leafsTop: -198,
  leafsLeft: 66,
  leafsScale: 1.0,
  // Slika - direktna apsolutna pozicija u pt
  imageTop: -80,
  imageLeft: 30,
  imageWidth: 145,
  imageHeight: 180,
  // Godine - offset od flow pozicije
  yearsTop: 62,
  yearsLeft: 0,
  yearsFontSize: 32,
  // Tekst "Родбини..." - offset
  lightTextTop: 45,
  lightTextLeft: 30,
  lightTextFontSize: 17,
  // Ime i prezime - offset
  nameTop: 30,
  nameLeft: 0,
  nameFontSize: 50,
  // Glavni tekst - offset
  boldedTop: 0,
  boldedLeft: 0,
  boldedFontSize: 20,
  // Mourning ornament - offset od baze (baza: calc(50% + 139px), 268px)
  mourningTop: -48,
  mourningLeft: 39,
  mourningScale: 1.38,
  // "OŽALOŠĆENI" tekst - offset
  mourningTitleTop: 0,
  mourningTitleLeft: 0,
  mourningFontSize: 16,
  // Sadržaj ožalošćeni - offset
  mourningContentTop: 0,
  mourningContentLeft: 0,
  mourningContentFontSize: 18,
  // Boje
  textColor: '#000000',
  nameColor: '#000000',
  borderColor: '#333333',
};

// Konfiguracija opsega za svaki slider - široki simetrični opsezi
export const SLIDER_RANGES = {
  // Krst
  crossTop: { min: -300, max: 300 },
  crossLeft: { min: -300, max: 300 },
  crossScale: { min: 0.3, max: 2.5, step: 0.05 },
  // Lišće
  leafsTop: { min: -300, max: 300 },
  leafsLeft: { min: -300, max: 300 },
  leafsScale: { min: 0.3, max: 2.5, step: 0.05 },
  // Slika
  imageTop: { min: -100, max: 500 },
  imageLeft: { min: -50, max: 600 },
  imageWidth: { min: 60, max: 350 },
  imageHeight: { min: 60, max: 400 },
  // Godine
  yearsTop: { min: -300, max: 300 },
  yearsLeft: { min: -300, max: 300 },
  yearsFontSize: { min: 14, max: 60 },
  // Tekst "Родбини..."
  lightTextTop: { min: -300, max: 300 },
  lightTextLeft: { min: -300, max: 300 },
  lightTextFontSize: { min: 8, max: 30 },
  // Ime i prezime
  nameTop: { min: -300, max: 300 },
  nameLeft: { min: -300, max: 300 },
  nameFontSize: { min: 20, max: 90 },
  // Glavni tekst
  boldedTop: { min: -300, max: 300 },
  boldedLeft: { min: -300, max: 300 },
  boldedFontSize: { min: 8, max: 36 },
  // Mourning ornament
  mourningTop: { min: -300, max: 300 },
  mourningLeft: { min: -300, max: 300 },
  mourningScale: { min: 0.3, max: 3.0, step: 0.05 },
  // "OŽALOŠĆENI" tekst
  mourningTitleTop: { min: -300, max: 300 },
  mourningTitleLeft: { min: -300, max: 300 },
  mourningFontSize: { min: 8, max: 30 },
  // Sadržaj ožalošćeni
  mourningContentTop: { min: -300, max: 300 },
  mourningContentLeft: { min: -300, max: 300 },
  mourningContentFontSize: { min: 8, max: 30 },
};

// Predefinisane boje za color picker
export const COLOR_PRESETS = [
  '#000000', '#333333', '#555555', '#777777',
  '#999999', '#1a1a2e', '#16213e', '#0f3460',
  '#2c3e50', '#34495e', '#2c2c54', '#474787',
  '#192a56', '#273c75', '#40407a', '#706fd3',
  '#8b0000', '#800000', '#a52a2a', '#b22222',
];

// Konverzija: slider (0-100) -> vrijednost
export const sliderToValue = (sliderValue, key) => {
  const { min, max } = SLIDER_RANGES[key];
  return min + (sliderValue / 100) * (max - min);
};

// Konverzija: vrijednost -> slider (0-100)
export const valueToSlider = (value, key) => {
  const { min, max } = SLIDER_RANGES[key];
  return ((value - min) / (max - min)) * 100;
};
