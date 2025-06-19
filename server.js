require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const db = require("./models");
const init = require("./init/init");
/*
// Configuration CORS (à adapter selon domaine réel en production)
const allowedOrigins = [
  'http://localhost:5173'           // dev
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine CORS non autorisée: ${origin}`));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','x-access-token'],
  credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
**/
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/role.routes")(app);
require("./routes/admin.routes")(app);

app.use(errorHandler); // À la fin, pour capturer les erreurs

// Synchronisation BDD + Initialisation
const PORT = process.env.PORT || 8080;
db.sequelize.sync({ alter: true }).then(async () => {
  console.log("🔗 DB synchronisée.");
  //await init(); // création admin/rôles par défaut
  app.listen(PORT, () => {
    console.log(`🚀 Serveur actif sur le port ${PORT}`);
  });
});
