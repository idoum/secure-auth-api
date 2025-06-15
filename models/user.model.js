module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  // Associations
  User.associate = (models) => {
    // N:N avec rôles
    User.belongsToMany(models.role, {
      through: "user_roles",
      as: "roles",
      foreignKey: "userId",
    });

    // 1:N avec logs
    User.hasMany(models.log, {
      as: "logs",
      foreignKey: "userId",
    });

    // 1:N avec tokens de réinitialisation
    User.hasMany(models.password_reset_token, {
      as: "resetTokens",
      foreignKey: "userId",
    });
  };

  return User;
};
