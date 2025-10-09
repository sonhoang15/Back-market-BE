'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.Order_Items, { foreignKey: 'order_id', as: 'items' });
        }
    }

    Order.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            user_id: DataTypes.INTEGER,
            total_price: DataTypes.DECIMAL(12, 2),
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'Orders',
            timestamps: true,
        }
    );

    return Order;
};
