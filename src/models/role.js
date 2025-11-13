'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Role.belongsToMany(models.Group, {
                through: models.GroupRole,
                foreignKey: 'roleId',
                otherKey: 'groupId',
            });
        }
    };
    Role.init({
        url: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'Roles', // SỬA THÀNH 'Roles'
        underscored: true, // THÊM DÒNG NÀY
        timestamps: true // THÊM DÒNG NÀY
    });
    return Role;
};