import * as SQLite from 'expo-sqlite';

const DB_NAME = 'protectors.db';

export async function getDb() {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS protectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      size REAL,
      notch TEXT,
      pid TEXT
    );
  `);

  // Optional: Seed data if empty
  const firstRow = await db.getFirstAsync('SELECT * FROM protectors LIMIT 1');
  if (!firstRow) {
    await db.runAsync(
      "INSERT INTO protectors (brand, model, size, notch, pid) VALUES (?, ?, ?, ?, ?)",
      ['Samsung', 'Galaxy A12', 6.5, 'Waterdrop', 'PID-SAM-01']
    );
    await db.runAsync(
      "INSERT INTO protectors (brand, model, size, notch, pid) VALUES (?, ?, ?, ?, ?)",
      ['Vivo', 'Y20', 6.51, 'Waterdrop', 'PID-VIV-02']
    );
  }
}
