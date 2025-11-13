'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',  // DÙNG user_id thay vì user_Id
                as: 'user'
            });
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
