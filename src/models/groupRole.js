'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class GroupRole extends Model {
        static associate(models) {
        }
    };
    GroupRole.init({
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'role_id',
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'group_id',
        },
    }, {
        sequelize,
        modelName: 'GroupRole',
        tableName: 'GroupRole',
        underscored: true,
        timestamps: true
    });
    return GroupRole;
};