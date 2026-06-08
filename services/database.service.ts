import * as SQLite from 'expo-sqlite';

// Fungsi untuk menginisialisasi database dan membuat tabel jika belum ada
export async function initializeDatabase() {
  const db = await SQLite.openDatabaseAsync('todo-app.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS todos (
      id_todo INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK( status IN ('open','completed') ) DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME DEFAULT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  try {
    await db.execAsync(`ALTER TABLE todos ADD COLUMN deleted_at DATETIME DEFAULT NULL;`);
  } catch (e) {
    // Abaikan jika kolom sudah ada
  }
  
  return db;
}

// Helper untuk mendapatkan instance database di mana saja
export async function getDbConnection() {
  return await SQLite.openDatabaseAsync('todo-app.db');
}
