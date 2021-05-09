'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class KHOAHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.TAGKH, { through: models.TAGKH_KHOAHOC, foreignKey: 'KHOAHOCId', as: 'khoahoc_tagkh' });
            this.belongsToMany(models.CHUDEKH, { through: models.CHUDE_KHOAHOC, foreignKey: 'KHOAHOCId', as: 'khoahoc_chudekh' })
            this.hasMany(models.BAIHOC, { as: 'khoahoc_baihoc' });
        }
    };
    KHOAHOC.init({
        TENKH: DataTypes.STRING,
        KH_IMG: DataTypes.STRING(1024),
        DESCRIPTION: DataTypes.STRING(1024),
        SO_BAI_HOC: DataTypes.INTEGER,
        GIANGVIENId: DataTypes.INTEGER,
        LUOT_XEM_KH: DataTypes.INTEGER,
        THONG_TIN_KH: DataTypes.TEXT('long'),
    }, {
            sequelize,
            modelName: 'KHOAHOC',
            freezeTableName: true,
        });
    return KHOAHOC;
};