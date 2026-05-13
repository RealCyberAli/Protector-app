import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';

export default function AddScreen() {
  const [form, setForm] = useState({ brand: '', model: '', size: '', notch: '', pid: '' });
  const router = useRouter();

  const save = async () => {
    if (!form.brand || !form.model) return Alert.alert("Error", "Fill in Brand and Model");
    const db = await SQLite.openDatabaseAsync('protectors.db');
    await db.runAsync(
      "INSERT INTO protectors (brand, model, size, notch, pid) VALUES (?, ?, ?, ?, ?)",
      [form.brand, form.model, parseFloat(form.size) || 0, form.notch, form.pid]
    );
    Alert.alert("Success", "Model saved!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Model</Text>
      <TextInput placeholder="Brand (e.g. Vivo)" style={styles.input} placeholderTextColor="#666" onChangeText={t => setForm({...form, brand: t})} />
      <TextInput placeholder="Model (e.g. Y20)" style={styles.input} placeholderTextColor="#666" onChangeText={t => setForm({...form, model: t})} />
      <TextInput placeholder="Screen Size (e.g. 6.51)" keyboardType="numeric" style={styles.input} placeholderTextColor="#666" onChangeText={t => setForm({...form, size: t})} />
      <TextInput placeholder="Notch Type" style={styles.input} placeholderTextColor="#666" onChangeText={t => setForm({...form, notch: t})} />
      <TextInput placeholder="Protector ID (PID)" style={styles.input} placeholderTextColor="#666" onChangeText={t => setForm({...form, pid: t})} />
      
      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Phone Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}><Text style={{color: '#888', textAlign: 'center'}}>Cancel</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0c0c', padding: 25, paddingTop: 80 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { backgroundColor: '#1a1a1a', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
