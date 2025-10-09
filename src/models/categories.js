'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // Một category có nhiều product
            Category.hasMany(models.Product, {
                foreignKey: 'category_id',
                as: 'products',
            });
        }
    }

    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            // Phân biệt nguồn dữ liệu (crawl, thêm tay, import)
            source_type: {
                type: DataTypes.ENUM('manual', 'crawler', 'import'),
                allowNull: false,
                defaultValue: 'manual',
            },
        },
        {
            sequelize,
            modelName: 'Category',
            tableName: 'Categories',
            timestamps: true, // createdAt + updatedAt tự động
            underscored: true, // Dùng snake_case cho cột trong DB (nếu bạn thích đồng nhất)
        }
    );

    return Category;
};
