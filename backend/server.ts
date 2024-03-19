import { createServer, IncomingMessage, ServerResponse } from 'http';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import csv from 'csv-parser';
import fs from 'fs';
import multer from 'multer';

// Configuration for multer for file upload handling
const upload = multer({ dest: 'uploads/' });

// Port on which the server listens for requests
const PORT = 3000;

// Function to process POST request
export async function handlePostRequest(req: IncomingMessage, res: ServerResponse, db: Database<sqlite3.Database>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Use multer to handle file upload
  upload.single('file')(req, res, async (err: multer.MulterError) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error uploading file' }));
      return;
    }

    if (!req.file) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No file uploaded' }));
      return;
    }

    try {
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
          fs.unlinkSync(req.file.path);
          // Send response to the client
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'File uploaded successfully' }));
        });
    } catch (error) {
      console.error('Error processing CSV file:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error processing CSV file' }));
    }
  });
}

// Function to handle GET request
export async function handleGetRequest(req: IncomingMessage, res: ServerResponse, db: Database<sqlite3.Database>) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    // Get users from the SQLite database
    const query = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('q');
    let users;
    if (query) {
      users = await db.all(`SELECT * FROM users WHERE name LIKE '%${query}%' OR city LIKE '%${query}%' OR country LIKE '%${query}%' OR favorite_sport LIKE '%${query}%'`);
    } else {
      users = await db.all('SELECT * FROM users');
    }
    console.log('Retrieved users:', users);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ data: users }));
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error retrieving users' }));
  }
}

// Initialize the HTTP server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  console.log(`Received ${req.method} request at ${req.url}`);

  // Connect to the SQLite database
  const db = await open({
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

  if (db) {
    console.log('Database opened successfully.');
  } else {
    console.error('Failed to open database.');
  }

  if (req.method === 'POST' && req.url === '/api/files') {
    await handlePostRequest(req, res, db);
  } else if (req.method === 'GET' && req.url?.startsWith('/api/users')) {
    await handleGetRequest(req, res, db);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});


