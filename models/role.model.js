module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("role", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

    // Associations
    Role.associate = (models) => {
    Role.belongsToMany(models.user, {
      through: "user_roles",
      as: "users",
      foreignKey: "roleId"
    });
  };

  return Role;
};
