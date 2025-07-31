'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Color extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Một màu có thể dùng cho nhiều biến thể sản phẩm
            Color.hasMany(models.Product_Variants, { foreignKey: 'color_id' });
        }
    };
    Color.init({
        id: DataTypes.STRING,
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Color',
        tableName: 'Color',
    });
    return Color;
};