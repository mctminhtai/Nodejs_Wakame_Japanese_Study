'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MONHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.LOPHOC, { as: 'lophoc1' });
        }
    };
    MONHOC.init({
        TEN_MH: DataTypes.STRING,
        SO_TIN_CHI: DataTypes.INTEGER,
        DKTQ: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'MONHOC',
            freezeTableName: true,
        });
    return MONHOC;
};