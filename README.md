# 🎨 Krsic Centar Mobile - Sa Settings Screen-om

## 📦 Šta Je Novo?

- ⚙️ **Settings Screen** sa sliderima za sve elemente layout-a
- 💾 **AsyncStorage** za trajno čuvanje postavki
- 🔄 **Reset na Default** opcija
- 📱 **React Navigation** za navigaciju između ekrana
- 🎯 **Live Update** - postavke se čuvaju i primjenjuju automatski

---

## 🚀 Instalacija

### 1. **Instaliraj Dependencies**

```bash
cd krsic-centar-mobile
npm install
```

**VAŽNO:** Ovo će instalirati sve potrebne pakete uključujući:
- `@react-native-async-storage/async-storage` - Za čuvanje postavki
- `@react-navigation/native` - Za navigaciju
- `@react-navigation/native-stack` - Stack navigator
- `react-native-safe-area-context` - Safe area support
- `react-native-screens` - Optimizovani ekrani

### 2. **Pokreni Projekat**

```bash
# Za Android
npm run android

# Za iOS (samo na Mac-u)
npm run ios

# Ili expo start
npm start
```

---

## 📱 Kako Koristiti Settings

### Otvaranje Settings Ekrana

1. Pokreni aplikaciju
2. Na glavnom ekranu, **klikni na dugme "⚙️ Postavke Layout-a"** (na vrhu)
3. Otvoriće se Settings ekran sa sliderima

### Podešavanje Elementa

Svaki element ima slidere za pozicioniranje:

#### ⛪ **Križ**
- **Pozicija Gore/Dole** (-300 do 100)
- **Pozicija Lijevo/Desno** (300 do 600)

#### 🖼️ **Slika**
- **Pozicija Gore/Dole** (80 do 200)
- **Pozicija Lijevo/Desno** (10 do 100)

#### 📅 **Godine (1945. - 2025.)**
- **Pozicija Gore/Dole** (-100 do 50)

#### 📝 **Tekst "Родбини..."**
- **Razmak Gore** (0 do 30)

#### 👤 **Ime i Prezime**
- **Pozicija Gore/Dole** (-20 do 40)

#### 📄 **Glavni Tekst**
- **Razmak Gore** (5 do 30)

#### 🌸 **Mourning Simbol**
- **Pozicija Gore/Dole** (180 do 300)
- **Pozicija Lijevo/Desno** (250 do 450)

#### 💐 **"ОЖАЛОШЋЕНИ" Tekst**
- **Razmak Gore** (10 do 40)

#### 🍃 **Lišće (ornamenti)**
- **Pozicija Gore/Dole** (-200 do -50)

### Čuvanje Postavki

1. Pomjeri slidere kako želiš
2. Klikni **"💾 Sačuvaj Promjene"**
3. Postavke će biti sačuvane trajno

### Vraćanje na Default

- Klikni **"🔄 Vrati na Default"**
- Potvrdi da želiš vratiti sve na početne vrijednosti
- Klikni "💾 Sačuvaj Promjene" da trajno sačuvaš default vrijednosti

---

## 🏗️ Struktura Projekta

```
krsic-centar-mobile/
├── App.js                      # Main app sa navigacijom
├── HomeScreen.js               # Glavni ekran (bivši App.js)
├── SettingsScreen.js           # Settings ekran sa sliderima
├── HtmlGenerator.js            # Generator HTML-a sa layout support
├── components/
│   ├── Header.jsx
│   ├── Stepper.jsx
│   ├── CustomImagePicker.jsx
│   └── CustomTextInput.jsx
├── json_exports/
│   └── stepperData.json
├── svg_exports/
│   ├── cross.js
│   ├── lisce.js
│   └── mourning.js
├── assets/
│   └── ...
├── package.json
└── README.md
```

---

## 🔧 Tehnički Detalji

### Layout Settings Format

Postavke se čuvaju u AsyncStorage kao JSON:

```javascript
{
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
}
```

### Kako Radi?

1. **HomeScreen** učitava settings iz AsyncStorage pri pokretanju
2. Kada korisnik kreira PDF, **HtmlGenerator** prima `layoutSettings` objekat
3. CSS u HTML-u koristi vrijednosti iz settings-a za pozicioniranje
4. **SettingsScreen** omogućava izmjenu i čuvanje postavki

### Primjena u HtmlGenerator.js

```javascript
// Primjer kako se koriste settings u CSS-u:
img {
  top: ${layout.imageTop}px;    // Dinamička vrijednost
  left: ${layout.imageLeft}px;   // Iz settings-a
}
```

---

## 🐛 Troubleshooting

### Problem: "Cannot find module '@react-native-async-storage/async-storage'"

**Rješenje:**
```bash
npm install @react-native-async-storage/async-storage
npx expo start -c
```

### Problem: "Cannot find module '@react-navigation/native'"

**Rješenje:**
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npx expo start -c
```

### Problem: Postavke se ne čuvaju

**Rješenje:**
1. Provjeri da si kliknuo "💾 Sačuvaj Promjene"
2. Restartuj aplikaciju
3. Ako i dalje ne radi:
```bash
# Clear cache
npx expo start -c
```

### Problem: Layout izgleda čudno nakon izmjena

**Rješenje:**
- Klikni "🔄 Vrati na Default"
- Klikni "💾 Sačuvaj Promjene"
- Kreiraj novi PDF i provjeri

---

## 💡 Savjeti za Najbolji Layout

### 1. **Postepeno Podešavanje**
- Mijenjaj po jednu vrijednost odjednom
- Sačuvaj i testiraj nakon svake promjene

### 2. **Default Vrijednosti su Optimalne**
- Default postavke su testirane i funkcionišu dobro
- Koristi ih kao osnovu

### 3. **Testiranje**
- Kreiraj test PDF sa dummy podacima
- Provjeri kako izgleda prije nego promijeniš puno stvari

### 4. **Backup**
- Ako nađeš dobar layout, napiši vrijednosti negdje
- Možeš ih onda vratiti ako nešto pokvarilješ

---

## 📞 Podrška

Ako imaš problema ili pitanja:

1. Provjeri **Troubleshooting** sekciju
2. Vrati postavke na default
3. Restartuj aplikaciju sa `npm start`

---

## 🎉 Features

✅ Dinamičko pozicioniranje svih elemenata
✅ Trajno čuvanje postavki
✅ Jednostavno vraćanje na default
✅ Live preview vrijednosti na sliderima
✅ Intuitivna navigacija
✅ Sigurno čuvanje podataka

---

**Verzija:** 2.0 sa Settings  
**Datum:** Februar 2026  
**Status:** Production Ready 🚀
