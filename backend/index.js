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

// Post Listing
app.post('/api/listings', (req, res) => {
  const {
    title,
    category,
    subcategory,
    price,
    description,
    attributes,
    location,
    contact,
    user_id
  } = req.body;

  const listingId = Date.now().toString();

  const query = `
    INSERT INTO Listings
    (ListingID, Title, Category, Subcategory, Price, Description, Attributes, Location, Contact, UserID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      listingId,
      title,
      category,
      subcategory,
      price || null,
      description || '',
      JSON.stringify(attributes),
      location || '',
      contact || '',
      user_id || null
    ],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create listing' });
      }

      res.json({ message: 'Listing created successfully', id: listingId });
    }
  );
});

// Get Listings
app.get('/api/listings', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const { category, subcategory } = req.query;

  if (!category || !subcategory) {
    return res.status(400).json({ error: 'Missing category or subcategory' });
  }

  console.log(subcategory);
  const fixedSubcategory = subcategory.toString().replace(/\s{2,}/g, ' + ').trim();

  db.query(
    `SELECT * FROM Listings WHERE LOWER(Category) = ? AND LOWER(Subcategory) = ? ORDER BY CreatedAt DESC`,
    [category, fixedSubcategory],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch listings' });
      }

      console.log("Results from DB:", results);

      const listings = results.map((row) => {
        let parsedAttributes = {};
        try {
          parsedAttributes = typeof row.Attributes === 'string'
            ? JSON.parse(row.Attributes)
            : row.Attributes || {};
        } catch (err) {
          console.warn("Invalid JSON in Attributes:", row.Attributes);
        }

        return {
          id: row.ListingID,
          title: row.Title,
          price: row.Price,
          description: row.Description,
          category: row.Category,
          subcategory: row.Subcategory,
          attributes: parsedAttributes,
          location: row.Location,
          contact: row.Contact,
          createdAt: row.CreatedAt,
          user_id: row.UserID
        };
      });

      res.json(listings);
    }
  );
});

app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}
));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), {
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
