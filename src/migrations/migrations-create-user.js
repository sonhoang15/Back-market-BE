'use strict';
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },

    // 🆕 Thêm các trường thông tin cá nhân
    full_name: {
      type: Sequelize.STRING
    },
    birthday: {
      type: Sequelize.DATEONLY
    },
    province: {
      type: Sequelize.STRING
    },
    district: {
      type: Sequelize.STRING
    },
    ward: {
      type: Sequelize.STRING
    },

    address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    group_id: {
      type: Sequelize.INTEGER
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
  await queryInterface.dropTable('Users');
};
