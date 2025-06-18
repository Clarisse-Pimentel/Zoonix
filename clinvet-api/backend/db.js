import mysql from 'mysql2/promise';
import fs from 'fs/promises';

let db;

async function initDatabase() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Dudu26/12',
      database: 'clinvet',
      multipleStatements: true,
    });

    console.log('Conectado ao banco de dados!');

    // Lê e executa o script SQL de criação das tabelas
    const sqlScript = await fs.readFile('./clinvet.sql', 'utf8');
    await db.query(sqlScript);
    console.log('Script SQL executado com sucesso!');
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
    process.exit(1);
  }
}

export { initDatabase, db };