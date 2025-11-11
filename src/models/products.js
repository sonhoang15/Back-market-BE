'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.Product_Variant, { foreignKey: 'product_id', as: 'variants' });
            Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
        }
    }

    Product.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: DataTypes.STRING, allowNull: false },
            description: DataTypes.TEXT,
            thumbnail: DataTypes.TEXT('long'),
            category_id: { type: DataTypes.INTEGER, allowNull: false },

            // 🧭 Phân biệt nguồn
            source: {
                type: DataTypes.ENUM('manual', 'crawl'),
                defaultValue: 'manual',
            },

            source_url: DataTypes.STRING,

            price_min: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
            price_max: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
            is_active: { type: DataTypes.BOOLEAN, defaultValue: true },

            // ⚙️ Trạng thái hiển thị (manual có thể published, crawl thì draft)
            status: {
                type: DataTypes.ENUM('draft', 'published', 'hidden'),
                defaultValue: 'draft',
                comment: 'Trạng thái hiển thị của sản phẩm',
            },

            // 🛠️ Nếu true → dữ liệu thủ công không bị ghi đè bởi crawl
            manual_override: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                comment: 'Nếu true, dữ liệu sẽ không bị ghi đè bởi dữ liệu crawl',
            },

            sync_status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "synced",
                comment: "Trạng thái đồng bộ dữ liệu crawl",
            },

            last_crawled_at: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "Thời điểm gần nhất crawl dữ liệu chi tiết sản phẩm",
            },

            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },

            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'Products',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        }
    );

    return Product;
};
