import express from 'express';
import { db } from '../db/index.js';

const router = express.Router();
export { router };

// Hilfsfunktion: "completed" Feld in Boolean umwandeln
const CompletedToBoolean = (todo) => ({
  ...todo,
  completed: !!todo.completed, // boolean umwandeln
});

// GET - Alle Todos abrufen
router.get('/', async (req, res) => {
  try {
    db.all('SELECT * FROM todos', [], (err, rows) => {
      if (err) throw new Error('Fehler in der Datenbank');
      const todos = rows.map(CompletedToBoolean);
      res.json(todos);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Einzelnes Todo per ID abrufen
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  db.get('SELECT * FROM todos WHERE id = ?', id, (err, row) => {
    if (err) return res.status(500).json({ error: 'Datenbankfehler' });
    if (!row) return res.status(404).json({ error: 'Todo nicht gefunden' });
    res.json(CompletedToBoolean(row));
  });
});

// POST - Neues Todo hinzufügen
router.post('/', (req, res) => {
  const { title, completed = false } = req.body;
  db.run(
    'INSERT INTO todos (title, completed) VALUES (?, ?)',
    [title, completed ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: 'Fehler beim Hinzufügen' });
      res.status(201).json({ id: this.lastID, title, completed });
    },
  );
});

// PUT - Todo vollständig bearbeiten
router.put('/:id', (req, res) => {
  const { title, completed } = req.body;

  if (!title || completed === undefined) {
    return res.status(400).json({ error: 'Title und Completed erforderlich' });
  }

  db.run(
    'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
    [title, completed ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Fehler beim Bearbeiten' });
      if (this.changes === 0)
        return res.status(404).json({ error: 'Todo nicht gefunden' });
      res.json({ id: req.params.id, title, completed: !!completed });
    },
  );
});

// // PATCH - Todo teilweise bearbeiten
// router.patch('/:id', (req, res) => {
//   const { title, completed } = req.body;
//   db.get('SELECT * FROM todos WHERE id = ?', [req.params.id], (err, row) => {
//     if (err) return res.status(500).json({ error: 'Datenbankfehler' });
//     if (!row) return res.status(404).json({ error: 'Todo nicht gefunden' });

//     const updatedTitle = title || row.title;
//     const updatedCompleted = completed !== undefined ? (completed ? 1 : 0) : row.completed;

//     db.run(
//       'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
//       [updatedTitle, updatedCompleted, req.params.id],
//       function (err) {
//         if (err) return res.status(500).json({ error: 'Datenbankfehler' });
//         if (this.changes === 0) return res.status(404).json({ error: 'Todo nicht gefunden' });
//         res.json({ id: req.params.id, title: updatedTitle, completed: !!updatedCompleted });
//       }
//     );
//   });
// });

// PATCH - Todo'yu kısmi olarak güncelle
// PATCH - Todo teilweise aktualisieren
router.patch('/:id', async (req, res) => {
  const { title, completed } = req.body;
  const id = Number(req.params.id);

  try {
    // Holen sich das Todo aus der Datenbank
    const todo = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM todos WHERE id = ?', id, (err, row) => {
        if (err) reject(err);
        if (!row) reject(new Error('Todo nicht gefunden'));
        resolve(row);
      });
    });
    //  die aktualisierten Daten vor
    const updatedTitle = title || todo.title;
    const updatedCompleted =
      completed !== undefined ? (completed ? 1 : 0) : todo.completed;
    // Aktualisierung die Daten in der Datenbank
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
        [updatedTitle, updatedCompleted, id],
        function (err) {
          if (err) reject(err);
          if (this.changes === 0) reject(new Error('Todo nicht gefunden'));
          resolve();
        },
      );
    });

    // das aktualisierte Todo zurück
    res.json({ id, title: updatedTitle, completed: !!updatedCompleted });
  } catch (err) {
    // Fehlerfall eine geeignete Antwort zurück
    if (err.message === 'Todo nicht gefunden') {
      res.status(404).json({ error: 'Todo nicht gefunden' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE - Todo löschen
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM todos WHERE id = ?', req.params.id, function (err) {
    if (err) return res.status(500).json({ error: 'Fehler beim Löschen' });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Todo nicht gefunden' });
    res.status(204).end();
  });
});
