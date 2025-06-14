const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importation des modèles
db.user = require("./user.model")(sequelize, DataTypes);
db.role = require("./role.model")(sequelize, DataTypes);
db.userRole = require("./userRole.model")(sequelize, DataTypes);
db.log = require("./log.model")(sequelize, DataTypes);
db.password_reset_token = require("./passwordResetToken.model")(sequelize, DataTypes);

// === Associations ===

// N:N entre user et role via userRole
db.user.belongsToMany(db.role, {
  through: db.userRole,
  as: "roles",
  foreignKey: "userId"
});
db.role.belongsToMany(db.user, {
  through: db.userRole,
  as: "users",
  foreignKey: "roleId"
});

// 1:N user → logs
db.user.hasMany(db.log, { as: "logs", foreignKey: "userId" });
db.log.belongsTo(db.user, { as: "user", foreignKey: "userId" });

// 1:N user → password reset tokens
db.user.hasMany(db.password_reset_token, { as: "resetTokens", foreignKey: "userId" });
db.password_reset_token.belongsTo(db.user, { as: "user", foreignKey: "userId" });

module.exports = db;
