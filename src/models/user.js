'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: 'group_id' });
      User.hasMany(models.Order, { foreignKey: 'user_id' });
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    groupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    timestamps: true
  });
  return User;
};