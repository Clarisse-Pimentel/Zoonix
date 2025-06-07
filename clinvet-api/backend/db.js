import mysql from 'mysql2';
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1357',
  database: 'clinvet'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao banco de dados!');
});

export default db;

