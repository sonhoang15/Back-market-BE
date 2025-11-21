'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    Order.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            user_id: DataTypes.INTEGER,

            email: DataTypes.STRING,
            username: DataTypes.STRING,
            phone: DataTypes.STRING,

            address: DataTypes.STRING,
            province: DataTypes.STRING,
            district: DataTypes.STRING,
            ward: DataTypes.STRING,

            note: DataTypes.TEXT,
            payment_method: DataTypes.STRING,

            total_price: DataTypes.DECIMAL(12, 2),
            status: { type: DataTypes.STRING, defaultValue: "pending" },
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
