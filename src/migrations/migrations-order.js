"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      email: { type: Sequelize.STRING, allowNull: true },
      username: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, allowNull: true },

      address: { type: Sequelize.STRING, allowNull: true },
      province: { type: Sequelize.STRING, allowNull: true },
      district: { type: Sequelize.STRING, allowNull: true },
      ward: { type: Sequelize.STRING, allowNull: true },

      note: { type: Sequelize.TEXT, allowNull: true },
      payment_method: { type: Sequelize.STRING, allowNull: true },

      total_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Order");
  },
};
