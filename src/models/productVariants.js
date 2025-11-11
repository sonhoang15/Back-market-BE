'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Product_Variant extends Model {
        static associate(models) {
            // Mỗi biến thể thuộc về một sản phẩm
            Product_Variant.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }

    Product_Variant.init(
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

            // Tên biến thể (VD: “Đen / Size M”)
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // Màu sắc
            color: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // Kích thước hoặc thuộc tính phân loại
            size: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // Giá bán
            price: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: true,
            },

            // Số lượng tồn kho
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            // Ảnh riêng của biến thể
            image: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },

            // URL gốc của biến thể (nếu lấy từ crawl)
            source_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            // 🏷️ Loại nguồn dữ liệu
            source_type: {
                type: DataTypes.ENUM('manual', 'crawler', 'import'),
                allowNull: false,
                defaultValue: 'manual',
            },

            // ⚙️ Trạng thái đồng bộ
            sync_status: {
                type: DataTypes.ENUM('synced', 'manual_edited'),
                allowNull: false,
                defaultValue: 'synced',
            },

            // 🕒 Lần crawl gần nhất
            last_crawled_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            // 🟢 Trạng thái biến thể
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Product_Variant',
            tableName: 'Product_Variants',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true, // ✅ Bật timestamps cho đồng nhất với Product
            underscored: true, // ✅ Giúp đồng bộ naming convention
        }
    );

    return Product_Variant;
};
