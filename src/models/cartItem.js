'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.Cart, {
                foreignKey: 'cart_id',
                as: 'cart',
            });

            CartItem.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });

            CartItem.belongsTo(models.ProductVariant, {
                foreignKey: 'variant_id',
                as: 'variant',
            });
        }
    }

    CartItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            cart_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            variant_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },

            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },

            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'CartItem',
            tableName: 'CartItems',
            timestamps: true,
            underscored: true,
        }
    );

    return CartItem;
};
