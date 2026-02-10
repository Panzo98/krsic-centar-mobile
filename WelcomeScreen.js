import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrossIcon from './components/icons/CrossIcon';
import MourningIcon from './components/icons/MourningIcon';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CrossIcon width={72} height={96} color="#c9a84c" />

        <Text style={styles.title}>Smrtovnice</Text>

        <MourningIcon width={120} height={12} />

        <Text style={styles.subtitle}>Dobrodosli</Text>

        <Text style={styles.description}>
          Prije koriscenja aplikacije potrebno je podesiti izgled dokumenta.
          Na sljedecem ekranu mozete prilagoditi raspored elemenata koristeci klizace.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.replace('Settings', { mode: 'setup' })}
        >
          <Text style={styles.buttonText}>Podesavanje izgleda</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>v2.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e0d6c2',
    marginTop: 20,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#c9a84c',
    marginTop: 24,
  },
  description: {
    fontSize: 15,
    color: '#a0a0b8',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#c9a84c',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  version: {
    textAlign: 'center',
    color: '#555',
    fontSize: 12,
    paddingBottom: 16,
  },
});
