'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
            OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'variant' });
            OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
        }
    }

    OrderItem.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            order_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            variant_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            price: DataTypes.DECIMAL(12, 2),
            total_price: DataTypes.DECIMAL(12, 2),
        },
        {
            sequelize,
            modelName: 'OrderItem',
            tableName: 'OrderItems',
            timestamps: false,
        }
    );

    return OrderItem;
};
