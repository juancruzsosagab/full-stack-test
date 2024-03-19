import { createServer, IncomingMessage, ServerResponse } from 'http';
import request from 'supertest';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { handlePostRequest, handleGetRequest } from '../server'; // Importa las funciones que deseas probar

let db: Database<sqlite3.Database>;

// Abre una conexión de base de datos de prueba en memoria antes de todas las pruebas
beforeAll(async () => {
  db = await open({
    filename: ':memory:',
    driver: sqlite3.Database
  });
});

// Cierra la conexión de base de datos después de todas las pruebas
afterAll(async () => {
  await db.close();
});

describe('POST /api/files', () => {
  it('should upload a CSV file and return 200', async () => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      await handlePostRequest(req, res, db);
    });

    const response = await request(server)
      .post('/api/files')
      .attach('file', '.test.csv')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ message: 'File uploaded successfully' });
  });

  // Agrega más pruebas para manejar casos de error, como archivos no adjuntos, etc.
});

describe('GET /api/users', () => {
  beforeAll(async () => {
    // Preparar datos de prueba en la base de datos
    await db.run('INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)', ['John Doe', 'New York', 'USA', 'Basketball']);
  });

  it('should return users data based on search query', async () => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      await handleGetRequest(req, res, db);
    });

    const response = await request(server)
      .get('/api/users?q=John')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toEqual('John Doe');
  });

  // Agrega más pruebas para manejar casos de búsqueda con diferentes consultas, errores, etc.
});
