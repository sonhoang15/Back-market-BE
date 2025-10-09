'use strict';
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Order', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    total_price: {
      type: Sequelize.STRING
    },
    payment_method: {
      type: Sequelize.DECIMAL(10, 2)
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Order');
}