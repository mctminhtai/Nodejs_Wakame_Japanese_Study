'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CHUDEKH extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.KHOAHOC, { through: models.CHUDE_KHOAHOC, foreignKey: 'CHUDEKHId', as: 'chudekh_khoahoc' });
        }
    };
    CHUDEKH.init({
        TEN_CHU_DE: DataTypes.STRING
    }, {
            sequelize,
            modelName: 'CHUDEKH',
            freezeTableName: true,
        });
    return CHUDEKH;
};