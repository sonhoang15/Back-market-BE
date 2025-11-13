'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
            OrderItem.belongsTo(models.ProductVariant, { foreignKey: 'product_variant_id', as: 'variant' });
        }
    }

    OrderItem.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            order_id: DataTypes.INTEGER,
            product_variant_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            price: DataTypes.DECIMAL(12, 2),
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
