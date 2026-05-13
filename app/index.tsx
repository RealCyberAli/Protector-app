import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme';

export default function Index() {
  const [search, setSearch] = useState('');
  const [phones, setPhones] = useState([]);
  const router = useRouter();

  useEffect(() => { loadData(); }, []);

  const loadData = async (text = "") => {
    const db = await SQLite.openDatabaseAsync('protectors.db');
    const results = text 
      ? await db.getAllAsync("SELECT * FROM protectors WHERE model LIKE ?", [`%${text}%`])
      : await db.getAllAsync("SELECT * FROM protectors");
    setPhones(results);
  };

  const checkCompatibility = async (item) => {
    const db = await SQLite.openDatabaseAsync('protectors.db');
    const matches = await db.getAllAsync(
      "SELECT * FROM protectors WHERE (pid = ? OR (notch = ? AND size BETWEEN ? AND ?)) AND id != ?",
      [item.pid, item.notch, item.size - 0.05, item.size + 0.05, item.id]
    );

    const message = matches.length > 0 
      ? matches.map(m => `• ${m.brand} ${m.model}`).join("\n")
      : "No direct matches found.";
    Alert.alert(`Matches for ${item.model}:`, message);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PROTECTOR_MATCHER</Text>
        <Text style={styles.label}>OFFLINE_DATABASE_V1.0</Text>
      </View>
      
      <TextInput 
        style={styles.searchBar}
        placeholder="SEARCH_MODEL..."
        placeholderTextColor={theme.colors.text_secondary}
        onChangeText={(t) => { setSearch(t); loadData(t); }}
      />

      <FlatList 
        data={phones}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => checkCompatibility(item)}>
            <View>
              <Text style={styles.modelText}>{item.brand.toUpperCase()} {item.model.toUpperCase()}</Text>
              <Text style={styles.specText}>{item.size} INCH // {item.notch.toUpperCase()}</Text>
            </View>
            <View style={styles.pidBadge}>
              <Text style={styles.pidText}>{item.pid}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Neo-Brutalist FAB with the specific shadow from your guidelines */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 10 },
  title: { color: theme.colors.text_primary, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  label: { color: theme.colors.accent, fontFamily: theme.fonts.mono, fontSize: 10, tracking: 2 },
  searchBar: { backgroundColor: theme.colors.surface, color: theme.colors.text_primary, padding: 15, fontSize: 18, fontFamily: theme.fonts.mono, borderBottomWidth: 2, borderBottomColor: theme.colors.accent },
  card: { backgroundColor: theme.colors.surface, padding: 20, marginBottom: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  modelText: { color: theme.colors.text_primary, fontSize: 16, fontWeight: 'bold' },
  specText: { color: theme.colors.text_secondary, fontFamily: theme.fonts.mono, fontSize: 12, marginTop: 4 },
  pidText: { color: theme.colors.accent, fontFamily: theme.fonts.mono, fontSize: 10, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', bottom: 30, right: 30, 
    backgroundColor: theme.colors.accent, width: 60, height: 60, 
    alignItems: 'center', justifyContent: 'center',
    // Neo-brutalist shadow from guidelines
    shadowColor: "#FFFFFF", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.2, shadowRadius: 0,
    elevation: 5
  },
  fabIcon: { color: 'white', fontSize: 30, fontWeight: 'bold' }
});
