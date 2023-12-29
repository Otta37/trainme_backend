// db.js
const mysql = require('mysql2');

// Crea una connessione al database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'USER1', // Inserisci il tuo nome utente MySQL
  password: 'USER1', // Inserisci la tua password MySQL
  database: 'trainme', // Inserisci il nome del tuo database
});

// Connetti al database
connection.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
  } else {
    console.log('Connessione al database MySQL riuscita!');
  }
});

// Esporta la connessione per utilizzarla altrove
module.exports = connection;
