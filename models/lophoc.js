'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LOPHOC extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.MONHOC, { foreignKey: 'MONHOCId', as: 'lophoc_monhoc' });
            this.hasMany(models.DS_LOP_HOC, { as: 'lophoc_dslophoc' });
            this.hasMany(models.TKB_DU_KIEN, { as: 'lophoc_tkb' });
        }
    };
    LOPHOC.init({
        MONHOCId: DataTypes.INTEGER
    }, {
            sequelize,
            modelName: 'LOPHOC',
            freezeTableName: true,
        });
    return LOPHOC;
};