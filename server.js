require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const db = require("./models");
const init = require("./init/init");

// Configuration CORS (à adapter selon domaine réel en production)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
};

app.use(cors(corsOptions));
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
