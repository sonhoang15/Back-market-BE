'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cart_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        variant_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },

        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },

        total_price: {
            type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.addConstraint('CartItems', {
        fields: ['cart_id'],
        type: 'foreign key',
        name: 'fk_cart_items_cart_id',
        references: {
            table: 'Carts',
            field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });


    await queryInterface.addConstraint('CartItems', {
        fields: ['product_id'],
        type: 'foreign key',
        name: 'fk_cart_items_product_id',
        references: {
            table: 'Products',
            field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('CartItems', {
        fields: ['variant_id'],
        type: 'foreign key',
        name: 'fk_cart_items_variant_id',
        references: {
            table: 'ProductVariants',
            field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('CartItems', 'fk_cart_items_cart_id');
    await queryInterface.removeConstraint('CartItems', 'fk_cart_items_product_id');
    await queryInterface.removeConstraint('CartItems', 'fk_cart_items_variant_id');

    await queryInterface.dropTable('CartItems');
}
