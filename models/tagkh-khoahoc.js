'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TAGKH_KHOAHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.KHOAHOC, { foreignKey: 'KHOAHOCId', as: 'tagkh_khoahoc_khoahoc' });
            this.belongsTo(models.TAGKH, { foreignKey: 'TAGKHId', as: 'tagkh_khoahoc_tagkh' });
        }
    };
    TAGKH_KHOAHOC.init({
        KHOAHOCId: DataTypes.INTEGER,
        TAGKHId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'TAGKH_KHOAHOC',
            freezeTableName: true,
        });
    return TAGKH_KHOAHOC;
};