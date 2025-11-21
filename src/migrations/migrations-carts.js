'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        status: {
            type: Sequelize.ENUM('active', 'checked_out', 'abandoned'),
            allowNull: false,
            defaultValue: 'active',
        },

        total_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },

        total_items: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
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

    await queryInterface.addConstraint('Carts', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_carts_user_id',
        references: {
            table: 'Users',
            field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
}

export async function down(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('Carts', 'fk_carts_user_id');

    await queryInterface.dropTable('Carts');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Carts_status";').catch(() => { });
}
