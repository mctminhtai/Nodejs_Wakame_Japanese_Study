'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BAIHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.KHOAHOC, { foreignKey: 'KHOAHOCId', as: 'baihoc_khoahoc' });
        }
    };
    BAIHOC.init({
        KHOAHOCId: DataTypes.INTEGER,
        TEN_BAI_HOC: DataTypes.STRING,
        LINK_BAIHOC: DataTypes.STRING(1024)
    }, {
            sequelize,
            modelName: 'BAIHOC',
            freezeTableName: true,
        });
    return BAIHOC;
};