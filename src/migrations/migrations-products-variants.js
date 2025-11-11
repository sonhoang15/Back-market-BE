'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Product_Variants', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'Products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    size: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    },
    source_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    source_type: {
      type: Sequelize.ENUM('manual', 'crawler', 'import'),
      allowNull: false,
      defaultValue: 'manual',
    },
    sync_status: {
      type: Sequelize.ENUM('synced', 'manual_edited'),
      allowNull: false,
      defaultValue: 'synced',
    },
    last_crawled_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Product_Variants');
}
