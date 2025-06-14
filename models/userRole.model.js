module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("user_role", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  // Associations
  UserRole.associate = (models) => {
    UserRole.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user"
    });
    UserRole.belongsTo(models.role, {
      foreignKey: "roleId",
      as: "role"
    });
  };

  return UserRole;
};
