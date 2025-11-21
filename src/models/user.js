'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsTo(models.Group, { foreignKey: 'group_id' });
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasOne(models.Cart, { foreignKey: 'user_id', as: 'cart' });
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    fullName: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    ward: DataTypes.STRING,
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
