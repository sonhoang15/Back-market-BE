'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, { foreignKey: "user_id" });
            Cart.hasMany(models.CartItem, { foreignKey: "cart_id", as: "items" });
        }
    }

    Cart.init({
        user_id: DataTypes.INTEGER,
        total_quantity: DataTypes.INTEGER,
        total_price: DataTypes.DECIMAL(10, 2),
        status: {
            type: DataTypes.STRING,
            defaultValue: "active",
        }
    }, {
        sequelize,
        modelName: "Cart",
        tableName: "Carts",
        underscored: true,
        timestamps: true
    });

    return Cart;
};
