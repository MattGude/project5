import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  socketPath: '/cloudsql/project5-456917:us-central1:project5-db',
  user: 'root',
  password: '',
  database: 'ameslist_db'
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM Users WHERE Username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.length > 0) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    db.query(
      'INSERT INTO Users (UserID, Username, Password) VALUES (?, ?, ?)',
      [userId, username, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: 'Insert failed' });
        return res.json({ message: 'Account created!' });
      }
    );
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM Users WHERE Username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, results[0].Password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });

    res.json({ message: 'Login successful', user: { id: results[0].UserID, username } });
  });
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
