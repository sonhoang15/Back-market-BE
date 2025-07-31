'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Images extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Images.belongsTo(models.Product_Variants, {
                foreignKey: 'product_variant_id',
                as: 'productVariant',
            });
        }
    };
    Images.init({
        id: DataTypes.STRING,
        product_variant_id: DataTypes.STRING,
        image_url: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Images',
        tableName: 'Images',
    });
    return Images;
};