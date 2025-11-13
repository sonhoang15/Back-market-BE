'use strict';
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Group_Role', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Roles',
        key: 'id'
      }
    },
    groupId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Groups',
        key: 'id'
      }
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
  await queryInterface.dropTable('Group_Role');
}