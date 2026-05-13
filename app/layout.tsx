import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function Layout() {
  useEffect(() => {
    async function initDB() {
      const db = await SQLite.openDatabaseAsync('protectors.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS protectors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          brand TEXT, model TEXT, size REAL, notch TEXT, pid TEXT
        );
      `);

      // Seed starter data if empty
      const count = await db.getFirstAsync('SELECT COUNT(*) as count FROM protectors');
      if (count.count === 0) {
        await db.runAsync("INSERT INTO protectors (brand, model, size, notch, pid) VALUES ('Samsung', 'Galaxy A12', 6.5, 'Waterdrop', 'PID-SAM-01')");
        await db.runAsync("INSERT INTO protectors (brand, model, size, notch, pid) VALUES ('Vivo', 'Y20', 6.51, 'Waterdrop', 'PID-VIV-02')");
      }
    }
    initDB();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
