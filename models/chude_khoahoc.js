'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CHUDE_KHOAHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.KHOAHOC, { foreignKey: 'KHOAHOCId', as: 'chude_khoahoc_khoahoc' });
            this.belongsTo(models.CHUDEKH, { foreignKey: 'CHUDEKHId', as: 'chude_khoahoc_chudekh' });
        }
    };
    CHUDE_KHOAHOC.init({
        KHOAHOCId: DataTypes.INTEGER,
        CHUDEKHId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'CHUDE_KHOAHOC',
            freezeTableName: true,
        });
    return CHUDE_KHOAHOC;
};