'use strict';

export async function up(queryInterface, Sequelize) {
  // 🧱 Tạo bảng Products
  await queryInterface.createTable('Products', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories', // ⚠️ phải đúng tên bảng trong migration categories
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    source: {
      type: Sequelize.ENUM('manual', 'crawl'),
      allowNull: false,
      defaultValue: 'manual',
    },
    source_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price_min: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    price_max: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: Sequelize.ENUM('pending', 'synced', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Trạng thái hiển thị của sản phẩm',
    },
    manual_override: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: 'Nếu true, dữ liệu sẽ không bị ghi đè bởi dữ liệu crawl',
    },
    sync_status: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'synced',
      comment: 'Trạng thái đồng bộ dữ liệu crawl',
    },
    last_crawled_at: {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Thời điểm gần nhất crawl dữ liệu chi tiết sản phẩm',
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Products');
}
