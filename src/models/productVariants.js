'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class ProductVariant extends Model {
        static associate(models) {
            // Mỗi biến thể thuộc về một sản phẩm
            ProductVariant.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }

    ProductVariant.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            color: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            size: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            price: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true,
            },

            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            image: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },

            source_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            source_type: {
                type: DataTypes.ENUM('manual', 'crawler', 'import'),
                allowNull: false,
                defaultValue: 'manual',
            },

            sync_status: {
                type: DataTypes.ENUM('synced', 'manual_edited', 'pending'),
                allowNull: false,
                defaultValue: 'pending'
            },

            last_crawled_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'ProductVariant',
            tableName: 'ProductVariants',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
        }
    );

    return ProductVariant;
};
