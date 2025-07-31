'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Một size có thể dùng trong nhiều biến thể sản phẩm
            Size.hasMany(models.Product_Variants, { foreignKey: 'size_id' });
        }
    };
    Size.init({
        id: DataTypes.STRING,
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Size',
        tableName: 'Size',
    });
    return Size;
};