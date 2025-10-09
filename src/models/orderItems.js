'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order_Items extends Model {
        static associate(models) {
            Order_Items.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
            Order_Items.belongsTo(models.Product_Variant, { foreignKey: 'product_variant_id', as: 'variant' });
        }
    }

    Order_Items.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            order_id: DataTypes.INTEGER,
            product_variant_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            price: DataTypes.DECIMAL(12, 2),
        },
        {
            sequelize,
            modelName: 'Order_Items',
            tableName: 'Order_Items',
            timestamps: false,
        }
    );

    return Order_Items;
};
