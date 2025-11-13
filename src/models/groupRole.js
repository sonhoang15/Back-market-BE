'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class GroupRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
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