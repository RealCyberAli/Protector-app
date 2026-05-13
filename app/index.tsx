import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';

export default function Index() {
  const [search, setSearch] = useState('');
  const [phones, setPhones] = useState([]);
  const router = useRouter();

  // Load data whenever the screen opens
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (text = "") => {
    const db = await SQLite.openDatabaseAsync('protectors.db');
    let results;
    if (text) {
      results = await db.getAllAsync("SELECT * FROM protectors WHERE model LIKE ?", [`%${text}%`]);
    } else {
      results = await db.getAllAsync("SELECT * FROM protectors");
    }
    setPhones(results);
  };

  const checkCompatibility = async (item) => {
    const db = await SQLite.openDatabaseAsync('protectors.db');
    
    // Find phones with same Protector ID OR same Notch + similar size
    const matches = await db.getAllAsync(
      "SELECT * FROM protectors WHERE (pid = ? OR (notch = ? AND size BETWEEN ? AND ?)) AND id != ?",
      [item.pid, item.notch, item.size - 0.05, item.size + 0.05, item.id]
    );

    const message = matches.length > 0 
      ? matches.map(m => `• ${m.brand} ${m.model}`).join("\n")
      : "No direct matches found. Try similar dimensions.";
    
    Alert.alert(`Compatible with ${item.model}:`, message);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protector Matcher</Text>
      
      <TextInput 
        style={styles.searchBar}
        placeholder="Search phone model..."
        placeholderTextColor="#888"
        onChangeText={(t) => { setSearch(t); loadData(t); }}
      />

      <FlatList 
        data={phones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => checkCompatibility(item)}>
            <Text style={styles.modelText}>{item.brand} {item.model}</Text>
            <Text style={styles.specText}>{item.size}" • {item.notch} • PID: {item.pid}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0c0c', padding: 20, paddingTop: 60 },
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  searchBar: { backgroundColor: '#1a1a1a', color: 'white', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
  card: { backgroundColor: '#161616', padding: 18, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  modelText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  specText: { color: '#888', fontSize: 14, marginTop: 4 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#007AFF', width: 65, height: 65, borderRadius: 32.5, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  fabText: { color: 'white', fontSize: 35, fontWeight: '300' }
});
