import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme, mono } from '../src/theme';
import { getDb, initDb } from '../src/db';
import { useRouter } from 'expo-router';

export default function Index() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    initDb().then(() => fetchModels());
  }, []);

  const fetchModels = async (text = '') => {
    const db = await getDb();
    const query = text 
      ? await db.getAllAsync('SELECT * FROM protectors WHERE model LIKE ?', [`%${text}%`])
      : await db.getAllAsync('SELECT * FROM protectors');
    setResults(query);
  };

  const showMatches = async (item: any) => {
    const db = await getDb();
    const matches = await db.getAllAsync(
      'SELECT * FROM protectors WHERE pid = ? AND id != ?',
      [item.pid, item.id]
    );
    
    const message = matches.length > 0 
      ? matches.map((m: any) => `• ${m.brand} ${m.model}`).join('\n')
      : "No direct matches found.";
    Alert.alert(`COMPATIBILITY: ${item.model}`, message);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.h1, { color: colors.textPrimary }]}>PROTECTOR_MATCHER</Text>
      
      <TextInput
        style={[styles.search, { backgroundColor: colors.inputBg, color: colors.textPrimary, borderColor: colors.accent }]}
        placeholder="SEARCH_MODEL..."
        placeholderTextColor={colors.textSecondary}
        onChangeText={(t) => { setSearch(t); fetchModels(t); }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => showMatches(item)}
          >
            <View>
              <Text style={[styles.model, { color: colors.textPrimary }]}>{item.brand} {item.model}</Text>
              <Text style={[styles.specs, { color: colors.textSecondary }]}>{item.size}" // {item.notch}</Text>
            </View>
            <Text style={[styles.pid, { color: colors.accent }]}>{item.pid}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.accent, shadowColor: colors.shadow }]}
        onPress={() => router.push('/add')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  h1: { fontSize: 28, fontWeight: '900', letterSpacing: -1, marginBottom: 20 },
  search: { height: 50, paddingHorizontal: 15, fontFamily: mono, borderBottomWidth: 2, marginBottom: 20 },
  card: { padding: 15, marginBottom: 1, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  model: { fontSize: 16, fontWeight: 'bold' },
  specs: { fontSize: 12, fontFamily: mono, marginTop: 4 },
  pid: { fontSize: 10, fontFamily: mono, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  fabIcon: { color: 'white', fontSize: 30, fontWeight: 'bold' }
});
