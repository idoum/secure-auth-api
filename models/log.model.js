module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("log", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING
    },
    userAgent: {
      type: DataTypes.STRING
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  Log.associate = (models) => {
    Log.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });
  };

  return Log;
};
