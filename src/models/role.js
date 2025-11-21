'use strict';

import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Role extends Model {

        static associate(models) {
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
        tableName: 'Roles',
        underscored: true,
        timestamps: true
    });
    return Role;
};