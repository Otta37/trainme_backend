// Importa il modulo Express
const express = require("express");
const db = require("./db");
const cors = require("cors");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

//moduli miei
const verifyToken = require("./private/functions/verifyToken");
const JWTKEY = require("./private/constant/jwtKey");
const manageQuery = require("./private/functions/manageQuery");

// Crea un'istanza di Express
const app = express();
app.use(express.json());

/* middleware CORS per tutte le origini */
const corsOptions = {
  origin: "*", // Sostituisci con l'URL del tuo frontend React
  credentials: true, // Abilita l'invio di cookie
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Definisci una route di esempio
app.get("/", (req, res) => {
  res.send("Benvenuto nella tua API Express!");
});

// Definisci una route di esempio
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT id, nome, cognome FROM `utente` WHERE `username` = ? AND `password` = ?",
    [username.toLowerCase(), password],
    function (err, results) {
      if (results.length > 0) {
        let user = results[0];
        jwt.sign(
          { user: user, exp: Date.now() / 1000 + 3600 },
          JWTKEY,
          (err, token) => {
            res.status(200).json({
              token,
            });
          }
        );
      } else
        res.status(401).json({
          error: "Credenziali non valide",
        });
    }
  );
});

app.get("/is_auth", verifyToken, (req, res) => {
  let auth = res.auth;

  //aggiorno il webtoken con la nuova data di scadenza
  jwt.sign(auth, JWTKEY, (err, token) => {
    res.status(200).json({
      token,
    });
  });
});
/* app.get("/schede", verifyToken, (req, res) => {

}) */

app.get("/schede/:id_scheda", verifyToken, (req, res) => {
  const id_utente = res.auth.user.id;
  const { id_scheda } = req.params;

  db.query(
    "SELECT * FROM scheda WHERE id = ? AND id_utente = ?",
    [id_scheda, id_utente],
    (err, results) => manageQuery(res, err, results)
  );
});

app.get("/schede", verifyToken, (req, res) => {
  const id_utente = res.auth.user.id;
  db.query(
    "SELECT * FROM scheda WHERE id_utente = ?",
    [id_utente],
    (err, results) => manageQuery(res, err, results)
  );
});

// Imposta la porta del server
const PORT = 3000;

/* */

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
