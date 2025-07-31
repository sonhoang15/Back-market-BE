'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order_Items extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order_Items.belongsTo(models.Order, { foreignKey: 'order_id' });
            Order_Items.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id' });
        }
    };
    Order_Items.init({
        order_id: DataTypes.INTEGER,
        product_variant_id: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        unit_price: DataTypes.DECIMAL(10, 2),
    }, {
        sequelize,
        modelName: 'Order_Items',
        tableName: 'Order_Items',
    });
    return Order_Items;
};