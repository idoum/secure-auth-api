module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define("password_reset_token", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  PasswordResetToken.associate = (models) => {
    PasswordResetToken.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });
  };

  return PasswordResetToken;
};
