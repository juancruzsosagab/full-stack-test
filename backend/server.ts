import express, { Request, Response } from 'express';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import csv from 'csv-parser';
import fs from 'fs';
import multer from 'multer';

// Configuration for multer for file upload handling
const upload = multer({ dest: 'uploads/' });

// Port on which the server listens for requests
const PORT = 3000;

// Initialize Express app
const app = express();

// Connect to the SQLite database
let db: Database<sqlite3.Database>;

async function connectDatabase() {
  db = await open({
    filename: './data.db',
    driver: sqlite3.Database
  });

  // Create the table in the SQLite database if it does not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      city TEXT,
      country TEXT,
      favorite_sport TEXT
    )
  `);

  console.log('Database opened successfully.');
}

connectDatabase();

// Function to process POST request
app.post('/api/files', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the CSV file and process the data
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data: any) => {
        await db.run(
          'INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)',
          [data.name, data.city, data.country, data.favorite_sport]
        );
      })
      .on('end', () => {
        // Remove the temporary file after use
        if(req.file){
          fs.unlinkSync(req.file.path);
          // Send response to the client
          res.status(200).json({ message: 'File uploaded successfully' });
        }

      });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    res.status(500).json({ error: 'Error processing CSV file' });
  }
});

// Function to handle GET request
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    // Get users from the SQLite database
    const query = req.query.q as string | undefined;
    let users;
    if (query) {
      users = await db.all(`SELECT * FROM users WHERE name LIKE '%${query}%' OR city LIKE '%${query}%' OR country LIKE '%${query}%' OR favorite_sport LIKE '%${query}%'`);
    } else {
      users = await db.all('SELECT * FROM users');
    }
    console.log('Retrieved users:', users);
    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
