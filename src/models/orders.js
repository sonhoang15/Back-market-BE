'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.User, { foreignKey: 'user_id' });
            Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
        }
    };
    Order.init({
        user_id: DataTypes.INTEGER,
        status: DataTypes.STRING,
        total_price: DataTypes.DECIMAL(10, 2),
        payment_method: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Order',
    });
    return Order;
};