'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product_Variants extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Mỗi variant thuộc về 1 sản phẩm
            Product_Variants.belongsTo(models.Product, { foreignKey: 'product_id' });

            // Mỗi variant có 1 màu và 1 size
            Product_Variants.belongsTo(models.Color, { foreignKey: 'color_id' });
            Product_Variants.belongsTo(models.Size, { foreignKey: 'size_id' });

            // Mỗi variant có thể xuất hiện trong nhiều order items
            Product_Variants.hasMany(models.Order_Items, { foreignKey: 'product_variant_id' });
        }
    };
    Product_Variants.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: DataTypes.STRING,
        color_id: DataTypes.STRING,
        size_id: DataTypes.STRING,
        stock: DataTypes.INTEGER,
        sku: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Product_Variants',
        tableName: 'Product_Variants',
    });
    return Product_Variants;
};