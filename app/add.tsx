import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme';

export default function AddScreen() {
  const [form, setForm] = useState({ brand: '', model: '', size: '', notch: '', pid: '' });
  const router = useRouter();

  const save = async () => {
    const db = await SQLite.openDatabaseAsync('protectors.db');
    await db.runAsync("INSERT INTO protectors (brand, model, size, notch, pid) VALUES (?, ?, ?, ?, ?)", [form.brand, form.model, parseFloat(form.size) || 0, form.notch, form.pid]);
    Alert.alert("DATA_SAVED", "Database updated successfully.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEW_ENTRY</Text>
      {['brand', 'model', 'size', 'notch', 'pid'].map((field) => (
        <View key={field} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{field.toUpperCase()}</Text>
          <TextInput 
            style={styles.input} 
            placeholder={`ENTER_${field.toUpperCase()}`} 
            placeholderTextColor="#444"
            onChangeText={t => setForm({...form, [field]: t})} 
          />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>COMMIT_TO_DATABASE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 30, paddingTop: 80 },
  title: { color: theme.colors.text_primary, fontSize: 32, fontWeight: '900', marginBottom: 40 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { color: theme.colors.text_secondary, fontFamily: theme.fonts.mono, fontSize: 10, marginBottom: 5 },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.text_primary, padding: 15, fontFamily: theme.fonts.mono, borderLeftWidth: 3, borderLeftColor: theme.colors.border },
  button: { backgroundColor: theme.colors.accent, padding: 20, marginTop: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontFamily: theme.fonts.mono }
});
