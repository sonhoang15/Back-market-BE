'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Categorie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Categorie.hasMany(models.Product, { foreignKey: 'category_id' });
        }
    };
    Categorie.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Categorie',
        tableName: 'Categorie',
    });
    return Categorie;
};