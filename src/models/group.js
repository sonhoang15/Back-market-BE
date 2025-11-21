'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class Group extends Model {

        static associate(models) {
            Group.hasMany(models.User, { foreignKey: 'group_id' });
            Group.belongsToMany(models.Role, {
                through: models.GroupRole,
                foreignKey: 'groupId',
                otherKey: 'roleId',
            });
        }
    };
    Group.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Group',
        tableName: 'Groups',
        underscored: true,
        timestamps: true
    });
    return Group;
};