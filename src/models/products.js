'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasMany(models.ProductVariant, { foreignKey: 'product_id' });
            Product.belongsTo(models.Category, { foreignKey: 'category_id' });
        }
    };
    Product.init({
        id: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        price: DataTypes.DECIMAL(10, 2),
        category_id: DataTypes.STRING,
        sku: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Product',
    });
    return Product;
};