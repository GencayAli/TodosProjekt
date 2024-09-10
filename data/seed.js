import sqlite3 from 'sqlite3';
const db = new sqlite3.Database(import.meta.dirname + '/todos.db');

db.run(
  `
      CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL
  )
  `,
  (result) => {
    if (!result) {
      console.log('Tabelle users angelegt');
    } else {
      console.log(result);
    }
  },
);
